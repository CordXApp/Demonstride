import type { FastifyPluginAsync } from 'fastify'

const Versions: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get('/versions', async (_request, _reply) => {
        try {
            const token = process.env.GH_TOKEN

            const owner = 'CordXApp'

            const repos = ['Client', 'Documentation', 'DNS', 'Proxy', 'Snaily', 'Website']

            if (!token) {
                throw new Error('GitHub token is not set in environment variables')
            }

            function cleanChangelogMessage(message: string): string {
                return message
                    .replace(/##\s+/g, '') // Remove '## ' headers
                    .replace(/```diff/g, '') // Remove '```diff' markers
                    .replace(/```/g, '') // Remove '```' markers
                    .replace(/\r?\n\+/g, '\n•') // Replace '+ ' with bullet points
                    .replace(/\r?\n-/g, '\n•') // Replace '- ' with bullet points
                    .replace(/\r?\n/g, '\n') // Replace '\r\n' or '\n' with '\n'
                    .replace(/---/g, '') // Remove '---' separators
                    .replace(/\*\*Full Changelog\*\*:/g, 'Full Changelog:') // Format 'Full Changelog' section
                    .replace(/\n{2,}/g, '\n') // Replace multiple newlines with a single newline
                    .replace(/\n•--/g, '') // Remove bullet points followed by '--'
                    .replace(/\n•/g, '\n• ') // Add space after bullet points
                    .trim() // Trim leading and trailing whitespace
            }

            const releases = await Promise.all(
                repos.map(async repo => {
                    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
                        headers: {
                            Authorization: `token ${token}`
                        }
                    })

                    if (!response.ok) {
                        throw new Error(`Failed to fetch releases for ${repo}`)
                    }

                    const data = await response.json()

                    // Extract the latest two versions
                    const latestReleases = data.slice(0, 2)
                    const current = latestReleases[0]?.tag_name || 'N/A'
                    const currentMessage = cleanChangelogMessage(latestReleases[0]?.body || 'No message')
                    const previous = latestReleases[1]?.tag_name || 'N/A'
                    const previousMessage = cleanChangelogMessage(latestReleases[1]?.body || 'No message')

                    return {
                        repo: `${repo}`,
                        versions: {
                            current: current,
                            currentMessage: currentMessage,
                            previous: previous,
                            previousMessage: previousMessage
                        }
                    }
                })
            )

            _reply.send({
                status: '[Demonstride:cordx_versions]',
                message: 'Here are the current and previous versions with messages',
                versions: releases
            })
        } catch (error) {
            fastify.log.error(error)
            _reply.status(500).send({
                status: '[Demonstride:internal_error]',
                message: 'Failed to fetch releases',
                cause: (error as Error).message,
                code: 500
            })
        }
    })
}

export default Versions
