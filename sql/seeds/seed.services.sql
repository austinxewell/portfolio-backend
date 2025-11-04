USE portfolio

INSERT INTO services (service_name, description, icon)
VALUES
    (
        'Web Development', 
        'Fast, accessible websites using modern stacks like Vue, Nuxt, and React — built with precision and performance in mind.',
        'i-lucide:code'
    ),
    (
        'Mobile Development',
        'Responsive, app-like experiences powered by frameworks like Nuxt, React Native, or PWA techniques to reach users on any device.',
        'i-lucide:smartphone'
    ),
    (
        'UX/UI Design',
        'Pixel-perfect interfaces crafted in Figma and brought to life in code — focused on clarity, usability, and impact.',
        'i-lucide:layout-dashboard'
    )
ON DUPLICATE KEY UPDATE
    service_name = VALUES(service_name)