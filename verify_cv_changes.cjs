const fs = require('fs');
const path = require('path');

const teamFile = path.join(__dirname, 'src/components/sections/Team.jsx');
const modalFile = path.join(__dirname, 'src/pages/admin/components/team/TeamFormModal.jsx');
const teamJsonFile = path.join(__dirname, 'public/content/team.json');

const teamContent = fs.readFileSync(teamFile, 'utf8');
const modalContent = fs.readFileSync(modalFile, 'utf8');
const teamJsonContent = JSON.parse(fs.readFileSync(teamJsonFile, 'utf8'));

let checks = [];

// Check team.json
const max = teamJsonContent.find(m => m.id === 'team-jundmc');
checks.push({
    file: 'team.json',
    check: 'Max has src_cv_pdf',
    passed: max && max.src_cv_pdf === "/assets/images/team/cvs/CV_VITAE_MAX.pdf"
});

const christian = teamJsonContent.find(m => m.id === 'team-7zc8ve');
checks.push({
    file: 'team.json',
    check: 'Christian has link_bio',
    passed: christian && (christian.link_bio || "").includes("linkedin.com")
});

// Check Team.jsx
checks.push({
    file: 'Team.jsx',
    check: 'Side-by-side buttons',
    passed: teamContent.includes('flex items-center justify-center gap-3')
});
checks.push({
    file: 'Team.jsx',
    check: 'View CV button',
    passed: teamContent.includes('View CV') && teamContent.includes('Ver CV')
});
checks.push({
    file: 'Team.jsx',
    check: 'Link Bio button',
    passed: teamContent.includes('Link Bio')
});

console.log(JSON.stringify(checks, null, 2));

// Check TeamFormModal.jsx
checks.push({
    file: 'TeamFormModal.jsx',
    check: 'Upload path corrected',
    passed: modalContent.includes('uploadPath: "public/assets/images/team/cvs/"')
});
checks.push({
    file: 'TeamFormModal.jsx',
    check: 'Data initialization src_cv_pdf',
    passed: modalContent.includes('src_cv_pdf: member.src_cv_pdf || ""')
});
checks.push({
    file: 'TeamFormModal.jsx',
    check: 'Preview props src_cv_pdf',
    passed: modalContent.includes('src_cv_pdf: data.src_cv_pdf || ""')
});

// Check team model normalization
const { normalizeTeamMember } = require('./src/models/team');
const testMember = {
    id: 'test',
    name: 'Test',
    src_cv_pdf: 'test.pdf',
    link_bio: 'test.com'
};
const normalized = normalizeTeamMember(testMember);
checks.push({
    file: 'src/models/team.js',
    check: 'normalizeTeamMember preserves src_cv_pdf',
    passed: normalized.src_cv_pdf === 'test.pdf'
});
checks.push({
    file: 'src/models/team.js',
    check: 'normalizeTeamMember preserves link_bio',
    passed: normalized.link_bio === 'test.com'
});

console.log(JSON.stringify(checks, null, 2));
