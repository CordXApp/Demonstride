import { UserMethods, Responses } from '@/types/index';
import { UserEntity } from '@/types/entitity';
import type CordX from '@/client';

export class UserClient {
    private client: CordX;

    constructor(client: CordX) {
        this.client = client;
    }

    public get model(): UserMethods {
        return {
            /**
             * Create a new user entity
             * @param avatar The user's avatar
             * @param banner The user's banner
             * @param username The user's username
             * @param globalName The user's global name
             * @param userid The user's Discord ID
             * @param folder The user's folder
             * @param entityId The user's entity ID
             * @returns { Promise<Responses> }
             */
            create: async ({ avatar, banner, username, globalName, userid, folder, entityId }: UserEntity): Promise<Responses> => {

                const required = !avatar || !banner || !username || !globalName || !userid || !folder || !entityId;
                if (required) return { success: false, message: 'Please provide all the required fields.' };

                try {

                    const user = await this.client.db.prisma.userEntity.create({
                        data: {
                            avatar,
                            banner,
                            username,
                            globalName,
                            userid,
                            entityId,
                        }
                    })

                    if (!user) return { success: false, message: 'Error creating user entity.' };

                    return { success: true, data: user };
                } catch (error: any) {
                    return { success: false, message: `Error creating user entity: ${error.message}` };
                }
            },

            fetch: async (id: string, id_type: 'DISCORD' | 'CORNFLAKE'): Promise<Responses> => {

                if (!id) return { success: false, message: 'Please provide a valid CordX Cornflake or Discord ID for the user.' };

                let user: any;

                if (id_type === 'DISCORD') {
                    user = await this.client.db.prisma.userEntity.findUnique({ where: { userid: id } });
                } else if (id_type === 'CORNFLAKE') {
                    user = await this.client.db.prisma.userEntity.findFirst({
                        where: { entityId: id },
                        select: {
                            avatar: true,
                            banner: true,
                            username: true,
                            globalName: true,
                            userid: true,
                            entityId: true,
                            _count: {
                                select: {
                                    orgs: true
                                }
                            }
                        }
                    });
                }

                if (!user) return {
                    success: false,
                    message: 'User not found, are you sure you provided the correct ID Type?',
                };

                return { success: true, data: user };
            }
        }
    }
}