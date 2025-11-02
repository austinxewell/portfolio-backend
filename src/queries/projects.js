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
    IFNULL(imgs.images, JSON_ARRAY()) AS images,
    IFNULL(tags.tech_tags, JSON_ARRAY()) AS tech_tags
FROM projects p
LEFT JOIN (
    SELECT
        pi.project_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'img_name', i.img_name,
                'img_url', i.img_url,
                'is_thumbnail', pi.is_thumbnail
            )
        ) AS images
    FROM project_images pi
    JOIN images i ON i.id = pi.image_id
    GROUP BY pi.project_id
) imgs ON imgs.project_id = p.id
LEFT JOIN (
    SELECT
        ptt.project_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'tag_name', tt.tag_name,
                'is_primary', ptt.is_primary
            )
        ) AS tech_tags
    FROM project_tech_tags ptt
    JOIN tech_tags tt ON tt.id = ptt.tag_id
    GROUP BY ptt.project_id
) tags ON tags.project_id = p.id
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
    IFNULL(imgs.images, JSON_ARRAY()) AS images,
    IFNULL(tags.tech_tags, JSON_ARRAY()) AS tech_tags
FROM projects p
LEFT JOIN (
    SELECT
        pi.project_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'img_name', i.img_name,
                'img_url', i.img_url,
                'is_thumbnail', pi.is_thumbnail
            )
        ) AS images
    FROM project_images pi
    JOIN images i ON i.id = pi.image_id
    GROUP BY pi.project_id
) imgs ON imgs.project_id = p.id
LEFT JOIN (
    SELECT
        ptt.project_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'tag_name', tt.tag_name,
                'is_primary', ptt.is_primary
            )
        ) AS tech_tags
    FROM project_tech_tags ptt
    JOIN tech_tags tt ON tt.id = ptt.tag_id
    GROUP BY ptt.project_id
) tags ON tags.project_id = p.id
WHERE p.slug = ?
LIMIT 1;
`;
