import type { FastifyPluginAsync } from "fastify";
import fastifyStatic from '@fastify/static';
import { readdirSync } from 'node:fs';
import { join, posix } from 'path';

/**
* @swagger
* /files:
*   get:
*     description: List all files and directories in the CDN.
*     responses:
*       200:
*         description: A list of all files and directories in the CDN.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/File'
*       500:
*         description: Unable to list files.
*/

/**
 * @swagger
 * components:
*   schemas:
*     File:
*       type: object
*       properties:
*         name:
*           type: string
*           description: The name of the file or directory.
*         isDirectory:
*           type: boolean
*           description: Indicates if the item is a directory.
*         path:
*           type: string
*           description: The relative path to the file or directory.
*         children:
*           type: array
*           items:
*             $ref: '#/components/schemas/File'
*           description: The list of files and directories within this directory (if it is a directory).
 */

const files: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    const directory = join(__dirname, '..', 'cdn');
    fastify.register(fastifyStatic, {
        root: directory,
        prefix: '/cdn/'
    });

    fastify.get('/files', async (_request, _reply) => {
        try {
            const fileList = await listFiles(directory);
            _reply.send(fileList);
        } catch (err: any) {
            _reply.status(500).send({ error: 'Unable to list files' });
        }
    });
}

async function listFiles(directory: string, basePath: string = '/cdn'): Promise<any[]> {
    const files = await readdirSync(directory, { withFileTypes: true });
    const fileList = await Promise.all(files.map(async (file) => {
        const fullPath = join(directory, file.name);
        const relativePath = posix.join(basePath, file.name);
        if (file.isDirectory()) {
            return {
                name: file.name,
                isDirectory: true,
                path: relativePath,
                children: await listFiles(fullPath, relativePath),
            };
        } else {
            return {
                name: file.name,
                isDirectory: false,
                path: relativePath,
            };
        }
    }));
    return fileList;
}

export default files;