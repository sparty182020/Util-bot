/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
    // Your code here
    app.log.info("Yay, the app was loaded!");
    const cfunc = require('sparty182020-utils')
    app.on("issues.opened", async (context) => {
        // Labels
        const tag = context.payload.issue.title.match(/\[[A-z]{3,}\]/)?.[0]
        switch (tag.replace(/\[|\]/gmi, '').toLowerCase()) {
            default:
                break
            case 'bug':
                await context.octokit.issues.addLabels(context.issue({
                    labels: ['bug']
                }))
                break
            case 'feature':
                await context.octokit.issues.addLabels(context.issue({
                    labels: ['enhancement']
                }))
                break
        }
        const issueComment = context.issue({
            body: "Thanks for opening this issue! A helper will be with you shortly.",
        });
        return context.octokit.issues.createComment(issueComment);
    });
    app.on('issue_comment.created',
        async (context) => {
            let tbl;
            //commands
            const commenter = context.payload.comment.user.login;
            const comment = context.payload.comment.body;
            if (commenter !== 'sparty182020' /* Repo Owner */) return
            if (!comment.includes('bot.')) return
            /* Valid Commands:
            * bot.addl.bug  => adds bug label
            * bot.addl.feature => adds enhancement label
            * bot.close => closes issue
            * bot.lock => locks issue
            */
            let command = []
            let multiline = (comment.split('\n').length > 1)
            if (!multiline) {
                command = [comment.slice(4)]
            } else {
                comment.split('\n').forEach((data) => {
                    command[command.length] = data.slice(4)
                })
            }
            Promise.resolve().then(_ => {
                command.forEach((data) => {
                    if (data.startsWith('addl.')) {
                        data = "a" + data.slice(5)
                    }
                    if (data.startsWith('reml.')) {
                        data = "r" + data.slice(5)
                    }
                    switch (data.toLowerCase()) {
                        case 'abug':
                            context.octokit.issues.addLabels(context.issue({
                                labels: ['bug']
                            }))
                            break
                        case 'rbug':
                            context.octokit.issues.removeLabel(context.issue({
                                name: 'bug'
                            }))
                            break;
                        case 'afeature':
                            context.octokit.issues.addLabels(context.issue({
                                labels: ['enhancement']
                            }))
                            break;
                        case 'rfeature':
                            context.octokit.issues.removeLabel(context.issue({
                                name: 'enhancement'
                            }))
                            break;
                        case 'close':
                            context.octokit.issues.update(context.issue({
                                state: 'closed'
                            }))
                            break
                        case 'lock':
                            tbl = true
                            break
                        default:
                            break
                    }
                })
            })
                .then(_ => {
                    context.octokit.issues.deleteComment(
                        {
                            owner: context.payload.repository.owner.login,
                            repo: context.payload.repository.name,
                            comment_id: context.payload.comment.id
                        }
                    )
                })
                .then(_ => {
                    if (tbl) {
                        context.octokit.issues.lock(context.issue(
                            {
                                lock_reason: "resolved"
                            }
                        ))
                    }
                })
        }
    )
    app.on('issue_comment.edited',
        async (context) => {
            let tbl;
            //commands
            const commenter = context.payload.comment.user.login;
            const comment = context.payload.comment.body;
            if (commenter !== 'sparty182020' /* Repo Owner */) return
            if (!comment.includes('bot.')) return
            /* Valid Commands:
            * bot.addl.bug  => adds bug label
            * bot.addl.feature => adds enhancement label
            * bot.close => closes issue
            * bot.lock => locks issue
            */
            let command = []
            let multiline = (comment.split('\n').length > 1)
            if (!multiline) {
                command = [comment.slice(4)]
            } else {
                comment.split('\n').forEach((data) => {
                    command[command.length] = data.slice(4)
                })
            }
            Promise.resolve().then(_ => {
                command.forEach((data) => {
                    if (data.startsWith('addl.')) {
                        data = "a" + data.slice(5)
                    }
                    if (data.startsWith('reml.')) {
                        data = "r" + data.slice(5)
                    }
                    switch (data.toLowerCase()) {
                        case 'abug':
                            context.octokit.issues.addLabels(context.issue({
                                labels: ['bug']
                            }))
                            break
                        case 'rbug':
                            context.octokit.issues.removeLabel(context.issue({
                                name: 'bug'
                            }))
                            break;
                        case 'afeature':
                            context.octokit.issues.addLabels(context.issue({
                                labels: ['enhancement']
                            }))
                            break;
                        case 'rfeature':
                            context.octokit.issues.removeLabel(context.issue({
                                name: 'enhancement'
                            }))
                            break;
                        case 'close':
                            context.octokit.issues.update(context.issue({
                                state: 'closed'
                            }))
                            break
                        case 'lock':
                            tbl = true
                            break
                        default:
                            break
                    }
                })
            })
                .then(_ => {
                    context.octokit.issues.deleteComment(
                        {
                            owner: context.payload.repository.owner.login,
                            repo: context.payload.repository.name,
                            comment_id: context.payload.comment.id
                        }
                    )
                })
                .then(_ => {
                    if (tbl) {
                        context.octokit.issues.lock(context.issue(
                            {
                                lock_reason: "resolved"
                            }
                        ))
                    }
                })
        }
    )

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
