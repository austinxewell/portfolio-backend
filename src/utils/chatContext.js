// utils/chatContext.js
import pool from '../db.js'

const PROFESSIONAL_START = new Date('2022-02-01')
const CODING_START = new Date('2019-12-01')

async function getProjectsWithDetails() {
    const [rows] = await pool.query(`
        SELECT
            p.id AS project_id, p.*,
            i.id AS image_id, i.img_name, i.img_url, i.created_at AS image_created_at, pi.is_thumbnail,
            t.id AS tag_id, t.tag_name, pt.is_primary
        FROM projects p
        LEFT JOIN project_images pi ON pi.project_id = p.id
        LEFT JOIN images i ON i.id = pi.image_id
        LEFT JOIN project_tech_tags pt ON pt.project_id = p.id
        LEFT JOIN tech_tags t ON t.id = pt.tag_id
    `)

    const projectsMap = new Map()

    for (const row of rows) {
        if (!projectsMap.has(row.project_id)) {
            projectsMap.set(row.project_id, {
                ...row,
                image_id: undefined,
                img_name: undefined,
                img_url: undefined,
                image_created_at: undefined,
                is_thumbnail: undefined,
                tag_id: undefined,
                tag_name: undefined,
                is_primary: undefined,
                images: [],
                tags: [],
            })
        }

        const project = projectsMap.get(row.project_id)

        if (row.image_id && !project.images.some((img) => img.id === row.image_id)) {
            project.images.push({
                id: row.image_id,
                img_name: row.img_name,
                img_url: row.img_url,
                created_at: row.image_created_at,
                is_thumbnail: Boolean(row.is_thumbnail),
            })
        }

        if (row.tag_id && !project.tags.some((tag) => tag.id === row.tag_id)) {
            project.tags.push({
                id: row.tag_id,
                tag_name: row.tag_name,
                is_primary: Boolean(row.is_primary),
            })
        }
    }

    return Array.from(projectsMap.values())
}

function getRelevantProjects(allProjects, userMessage) {
    const query = userMessage.toLowerCase()

    const scored = allProjects.map((p) => {
        const haystack = [
            p.project_name,
            p.description,
            ...p.tags.map((t) => t.tag_name),
        ].join(' ').toLowerCase()

        const score = haystack.split(' ').filter((word) => query.includes(word) && word.length > 3).length

        return { project: p, score }
    })

    const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score)

    return matched.length > 0
        ? matched.slice(0, 3).map((s) => s.project)
        : allProjects.slice(0, 3)
}

function matchesAny(text, userMessage) {
    const query = userMessage.toLowerCase()
    const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
    return words.some((word) => query.includes(word))
}

function formatProjects(projects, includeImages) {
    return projects.map((p) => {
        let line = `- ${p.project_name}: ${p.description} (Tech: ${p.tags.map((t) => t.tag_name).join(', ') || 'n/a'})`
        if (p.live_url) line += ` Live: ${p.live_url}.`
        if (p.github_url) line += ` GitHub: ${p.github_url}.`
        if (includeImages) {
            const thumb = p.images.find((img) => img.is_thumbnail)?.img_url
            if (thumb) line += ` Image: ${thumb}.`
        }
        return line
    }).join('\n')
}

function formatSkills(skills) {
    const expert = skills.filter((s) => s.level === 'expert').map((s) => s.name)
    const familiar = skills.filter((s) => s.level !== 'expert').map((s) => s.name)
    let text = ''
    if (expert.length) text += `Expert in: ${expert.join(', ')}. `
    if (familiar.length) text += `Also familiar with: ${familiar.join(', ')}.`
    return text.trim()
}

function formatServices(services) {
    return `Services offered: ${services.map((s) => s.service_name).join(', ')}.`
}

function formatRecommendations(recommendations) {
    const rec = recommendations[0]
    if (!rec) return ''
    return `"${rec.recommendation}" — ${rec.recommended_by}, ${rec.job_title} at ${rec.company_name}.`
}

function yearsSince(start) {
    const now = new Date()
    let years = now.getFullYear() - start.getFullYear()
    const hasHadAnniversaryThisYear =
        now.getMonth() > start.getMonth() ||
        (now.getMonth() === start.getMonth() && now.getDate() >= start.getDate())
    if (!hasHadAnniversaryThisYear) years--
    return years
}

function getPersonnelInfo() {
    const professionalYears = yearsSince(PROFESSIONAL_START)
    const totalYears = yearsSince(CODING_START)
    const professionalStartYear = PROFESSIONAL_START.getFullYear()
    const codingStartYear = CODING_START.getFullYear()

    return `${professionalYears}+ years professional (since ${professionalStartYear}), ${totalYears}+ years total since ${codingStartYear}.

Education: coding bootcamp through the University of Utah. Background is mostly hands-on — learned most from real production work, not the classroom.

At StarkSys (current employer, since ${professionalStartYear}): lead 4+ SaaS apps, contributed to many more (apps and high-traffic websites). Built internal platform for 300+ daily employees (+60% tracked activity). Set frontend architecture standards and code review practices. Build accessible (WCAG/ARIA) interfaces, CI/CD via Git, Docker, Kubernetes.

Before that (${codingStartYear} to ${professionalStartYear}): 3 years independent contractor, full-stack apps for small businesses end-to-end.`
}

export async function buildSystemPrompt(userMessage) {
    const [[aboutRows], [skills], projects, [services], [recommendations]] = await Promise.all([
        pool.query('SELECT * FROM about WHERE id = 1'),
        pool.query('SELECT * FROM skills'),
        getProjectsWithDetails(),
        pool.query('SELECT * FROM services'),
        pool.query('SELECT * FROM recommendations ORDER BY id DESC'),
    ])

    const about = aboutRows[0] ?? {}
    const query = userMessage.toLowerCase()

    const includeSkills = matchesAny(skills.map((s) => s.name).join(' '), userMessage)
        || /skill|tech|stack|know|experience|expert/.test(query)

    const includeServices = matchesAny(services.map((s) => s.service_name).join(' '), userMessage)
        || /service|hire|offer|freelance|work with/.test(query)

    const includePersonnelInfo = /experience|background|career|why|hire|about you|yourself|history|long|start|begin|learn|journey|role|position|study|studied|school|education|degree|bootcamp|university|college|where.*work|current(ly)? work|employ|company you|day job/.test(query)

    const includeImages = /image|photo|picture|screenshot|look|see/.test(query)

    const includeRecommendations = /work with|working with|colleague|coworker|teammate|reference|recommend|testimonial|review|opinion of you|like to work/.test(query)

    const relevantProjects = getRelevantProjects(projects, userMessage)

    const aboutText = `Name: ${about.name}. Title: ${about.title}. Specialty: ${about.specialty}. Contact: ${about.contact_email}. LinkedIn: ${about.linkedin_url}. GitHub: ${about.github_url}. Resume: ${about.resume_url}. Blog: ${about.blog_url}.`

    return `You speak as Austin Ewell's AI assistant on his portfolio site, AuEwellify. Respond in first person as Austin. Use ONLY the info below — no guessing.

Plain conversational text only, no markdown or bullet formatting in your reply. Keep answers short.

For persuasive questions ("why hire you"), pick 2-3 strongest points and make a case naturally — don't list everything.

When asked about education, school, or degree, always pair the answer with your hands-on experience — don't just state the bootcamp and stop. Make clear that real-world production work is where you've grown the most.

When citing a date from the information below, copy the exact month and year as written — do not shift it by a month or estimate.

If something's not covered below, say: "Great question! Austin's AI Model hasn't been trained on this subject — you might want to ask the real Austin this one." Keep it light.

ABOUT:
${aboutText}

${includeSkills ? `SKILLS:\n${formatSkills(skills)}\n` : ''}
${includePersonnelInfo ? `BACKGROUND:\n${getPersonnelInfo()}\n` : ''}
${includeRecommendations ? `WHAT A COLLEAGUE SAYS (quote naturally, don't recite word-for-word every time):\n${formatRecommendations(recommendations)}\n` : ''}
PROJECTS (${relevantProjects.length} most relevant — mention there are more if asked):
${formatProjects(relevantProjects, includeImages)}

${includeServices ? `SERVICES:\n${formatServices(services)}` : ''}
`
}