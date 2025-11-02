// src/queries/projects.js

export const getAllProjectsQuery = `
SELECT
    p.id,
    p.project_name,
    p.slug,
    p.overview,
    p.description,
    p.is_favorite,
    p.live_url,
    p.github_url,
    p.created_at,
    JSON_ARRAYAGG(
        JSON_OBJECT(
        'img_name', i.img_name,
        'img_url', i.img_url,
        'is_thumbnail', pi.is_thumbnail
        )
    ) AS images,
    JSON_ARRAYAGG(
        JSON_OBJECT(
        'tag_name', tt.tag_name,
        'is_primary', ptt.is_primary
        )
    ) AS tech_tags
FROM projects p
LEFT JOIN project_images pi ON pi.project_id = p.id
LEFT JOIN images i ON i.id = pi.image_id
LEFT JOIN project_tech_tags ptt ON ptt.project_id = p.id
LEFT JOIN tech_tags tt ON tt.id = ptt.tag_id
GROUP BY p.id
ORDER BY p.created_at DESC;
`;

export const getProjectBySlugQuery = `
SELECT
    p.id,
    p.project_name,
    p.slug,
    p.overview,
    p.description,
    p.is_favorite,
    p.live_url,
    p.github_url,
    p.created_at,
    JSON_ARRAYAGG(
        JSON_OBJECT(
        'img_name', i.img_name,
        'img_url', i.img_url,
        'is_thumbnail', pi.is_thumbnail
        )
    ) AS images,
    JSON_ARRAYAGG(
        JSON_OBJECT(
        'tag_name', tt.tag_name,
        'is_primary', ptt.is_primary
        )
    ) AS tech_tags
FROM projects p
LEFT JOIN project_images pi ON pi.project_id = p.id
LEFT JOIN images i ON i.id = pi.image_id
LEFT JOIN project_tech_tags ptt ON ptt.project_id = p.id
LEFT JOIN tech_tags tt ON tt.id = ptt.tag_id
WHERE p.slug = ?
GROUP BY p.id
LIMIT 1;
`;
