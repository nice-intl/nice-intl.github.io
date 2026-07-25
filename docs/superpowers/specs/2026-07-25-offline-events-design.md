# Shanghai and Shenzhen Offline Events Design

## Goal

Add two 2026 offline events to the NICE website while preserving the structure and visual language of the five existing event pages. Display every homepage event in reverse chronological order.

## New events

### World Model Night

- Date: July 18, 2026, 16:30–20:30
- Location: Shanghai
- Page path: `events/shanghai-world-model-night/index.html`
- Homepage title: `World Model Night: WAIC Closed-Door Meetup`
- Chinese homepage title: `世界模型之夜 · WAIC 闭门交流会`
- Hosts: NICE Academic and Yunqi Partners
- Format: Invite-only meetup and BBQ night for approximately 40 guests
- Detail-page structure: six speakers and panelists, followed by the two hosts

### Into Embodied AI

- Date: June 27, 2026, 14:00–18:30
- Location: Shenzhen InnoX
- Page path: `events/shenzhen-embodied-ai/index.html`
- Homepage title: `Into Embodied AI: Frontiers, Real-World Interaction & Startup Opportunities`
- Chinese homepage title: `走进具身智能：前沿技术、真实世界交互与创业机会`
- Host: NICE
- Co-hosts: FITX and Shenzhen InnoX
- Detail-page structure: eight unique speakers and panelists, followed by the host and co-hosts

## Homepage design

Add one card for each event to both `index.html` and `zh.html`. Use English copy on the English homepage and Chinese copy on the Chinese homepage.

All event cards will be ordered by date, newest first:

1. Shanghai World Model Night — July 18, 2026
2. Shenzhen Into Embodied AI — June 27, 2026
3. Beijing World Model — April 26, 2026
4. Shanghai OpenClaw — April 11, 2026
5. Shanghai Agent 2025 — November 30, 2025
6. Suzhou EMNLP Startup Night — November 5, 2025
7. Beijing RL Theory & Practice — October 18, 2025

Cards continue to use the existing location, date, title, short statistic, partner chips, and detail-link fields. No new card component or homepage styling is introduced.

## Detail-page design

Each new page will copy the established event-page structure:

1. NICE navigation and back link
2. Event hero with eyebrow, title, metadata, and a concise English introduction
3. Three summary statistics
4. Two-column details section for speakers/panelists and organizers
5. Full event poster
6. Existing footer treatment

The supplied Chinese text is source material, not copy that must appear verbatim. Detail pages remain English to match the existing five pages. The supplied poster images remain unchanged and retain their embedded QR codes.

The pages will not add an “event ended” label, standalone registration buttons, contact blocks, or an empty event gallery. The Shanghai page will mention the approximately 40-person format because it is explicitly supplied. The Shenzhen page will avoid inventing attendance numbers.

## Speakers and panelists

Names use English pinyin followed by the original Chinese characters so that the website remains consistent with the existing English detail pages without losing the spelling supplied by the posters. Roles are concise translations of poster content only.

### Shanghai

- Siheng Chen (陈思衡) — Associate Professor, School of Artificial Intelligence, Shanghai Jiao Tong University
- Yang Li (李阳) — John Hopcroft Assistant Professor, School of Computer Science, Shanghai Jiao Tong University
- Zhecheng Yuan (袁哲诚) — Co-founder & Chief Scientist, Pok Robotics (破壳机器人)
- Yingtian Zou (邹应天) — Founder, Sreal AI
- Hongyuan Lu (陆弘远) — Founder, 脸谱心智
- Zhaoxi Chen (陈昭熹) — Co-founder & CEO, Ropedia

The Shanghai summary statistics will show six speakers and panelists. Its organizer chips will be `NICE Academic` and `Yunqi Partners`.

### Shenzhen

- Kun Xie (谢琨) — Head of Strategic Partnerships, UBTECH Robotics
- Qiang Nie (聂强) — Assistant Professor, HKUST (Guangzhou)
- Ruimao Zhang (张瑞茂) — Associate Professor, Sun Yat-sen University
- Zhengxiang Chen (陈正翔) — Founder, TAKS Humanoid Robotics
- Sheng Xu (徐圣) — PhD Student, CUHK-Shenzhen
- Jiaze Wang (王佳泽) — Founder, FITX
- Linzhu Le (乐林株) — Founder & CEO, 光之跃迁
- Yizhou Fan (范翌洲) — Assistant Professor, The Chinese University of Hong Kong (Host)

Zhengxiang Chen appears in both the Talk and Startup areas of the poster and will be listed once. The Shenzhen summary statistics will therefore show eight unique speakers and panelists. Its organizer chips will be `NICE`, `FITX`, and `Shenzhen InnoX`.

## Assets and links

- Copy the Shanghai poster to `events/shanghai-world-model-night/poster.png`.
- Copy the Shenzhen poster to `events/shenzhen-embodied-ai/poster.png`.
- Poster QR codes remain visible.
- No standalone livestream link is added because none was supplied or reliably decoded.
- Existing LinkedIn links and all unrelated homepage content remain unchanged.

## Verification

Static tests will verify:

- Both new detail pages and poster assets exist.
- Both homepages link to both new pages.
- Event cards are in the required reverse-chronological order.
- New pages contain valid relative navigation and poster references.
- No empty gallery is rendered.
- Shanghai renders all six poster-listed speakers and panelists.
- Shenzhen renders all eight unique poster-listed speakers and panelists.
- Each page labels its organizer column `Partners & Co-hosts`.

Run the existing test suite and a local HTTP link check. Visually inspect the English homepage, Chinese homepage, and both new detail pages at desktop and mobile widths.
