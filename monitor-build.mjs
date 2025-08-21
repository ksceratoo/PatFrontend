#!/usr/bin/env node

// Monitor GitHub Actions build status
import { execSync } from 'child_process';
import fs from 'fs';

const REPO_OWNER = 'ksceratoo';
const REPO_NAME = 'PatFrontend';
const CHECK_INTERVAL = 30000; // 30 seconds

console.log('🔍 Monitoring mbcheck build status...\n');

async function checkGitHubActions() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=5`);
        const data = await response.json();

        if (!data.workflow_runs) {
            console.log('❌ Could not fetch GitHub Actions data');
            return;
        }

        const mbcheckRuns = data.workflow_runs.filter(run =>
            run.name === 'Build mbcheck for deployment'
        );

        if (mbcheckRuns.length === 0) {
            console.log('📭 No mbcheck build runs found');
            return;
        }

        const latestRun = mbcheckRuns[0];

        console.log(`📊 Latest build status:`);
        console.log(`   Status: ${getStatusEmoji(latestRun.status)} ${latestRun.status}`);
        console.log(`   Conclusion: ${getConclusionEmoji(latestRun.conclusion)} ${latestRun.conclusion || 'In progress'}`);
        console.log(`   Started: ${new Date(latestRun.created_at).toLocaleString()}`);
        console.log(`   URL: ${latestRun.html_url}`);
        console.log('');

        // If completed successfully, check for the binary file
        if (latestRun.conclusion === 'success') {
            console.log('✅ Build completed successfully! Checking for binary...');

            // Try to pull latest changes
            try {
                execSync('git pull origin main', { stdio: 'pipe' });

                if (fs.existsSync('patCom/paterl/mbcheck/mbcheck-linux')) {
                    console.log('🎉 mbcheck-linux binary is now available!');
                    console.log('🚀 Vercel will use real mbcheck on next deployment');
                    return true; // Stop monitoring
                } else {
                    console.log('⏳ Binary not yet available, will keep checking...');
                }
            } catch (error) {
                console.log('📋 Run "git pull origin main" to get the latest binary');
            }
        }

        return false; // Continue monitoring
    } catch (error) {
        console.log(`❌ Error checking status: ${error.message}`);
        return false;
    }
}

function getStatusEmoji(status) {
    switch (status) {
        case 'queued': return '⏳';
        case 'in_progress': return '🔄';
        case 'completed': return '✅';
        default: return '❓';
    }
}

function getConclusionEmoji(conclusion) {
    switch (conclusion) {
        case 'success': return '✅';
        case 'failure': return '❌';
        case 'cancelled': return '⏹️';
        case 'skipped': return '⏭️';
        default: return '🔄';
    }
}

// Initial check
const isDone = await checkGitHubActions();

if (!isDone) {
    console.log(`🔄 Will check again every ${CHECK_INTERVAL / 1000} seconds...`);
    console.log('Press Ctrl+C to stop monitoring\n');

    const interval = setInterval(async () => {
        const completed = await checkGitHubActions();
        if (completed) {
            clearInterval(interval);
            console.log('🏁 Monitoring complete!');
            process.exit(0);
        }
    }, CHECK_INTERVAL);
}
