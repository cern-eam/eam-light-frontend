const child = require("child_process");
const fs = require("fs");

const versionNumberRegex = new RegExp(/^(\d+\.)?(\d+\.)?(\*|\d+)$/);

// const getGitLogOutput = (repository, dir) => {
//     let mapVersion = ""
//     const output = child.execSync(`cd ${initialdir} && git --git-dir=${dir}/.git log --format=%B%H----DELIMITER----`).toString("utf-8")
//     const commitsArray = output.split("----DELIMITER----\n")
//         .map(commit => {
//             const [message, sha] = commit.split("\n");
//             if(Boolean(sha) === false) {
//                 console.log(commit)
//             }
//             return {sha, message, repository: repository};
//         })
//         .filter(commit => Boolean(commit.sha) && !filterCommitMessages.includes(commit.message));

//     commitsArray.forEach(commit => {
//         if (versionNumberRegex.test(commit.message)) {
//             mapVersion = commit.message
//         } else {
//             if (commitsMap.has(mapVersion)) {
//                 commitsMap.set(mapVersion, [commit, ...commitsMap.get(mapVersion)])
//             } else {
//                 commitsMap.set(mapVersion, [commit])
//             }
//         }
//     })
// }


const output = child.execSync(`git log --no-merges --pretty=oneline`).toString("utf-8")
output.split("\n").map(commit => {
    // const [sha, ...message] = commit.split(" ", 1);
    const sha = commit.substring(0, commit.indexOf(' '));
    const message = commit.substring(commit.indexOf(' ') + 1);
    console.log("SHA: ", sha, "MESSAGE: " , message)
})