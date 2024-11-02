import { UserMethods, Responses } from '@/types/index';
import type CordX from '@/client';

export class UserClient {
    private client: CordX;

    constructor(client: CordX) {
        this.client = client;
    }

    public get model(): UserMethods {
        return {

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