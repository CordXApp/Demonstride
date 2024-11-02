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

            fetch: async (id: UserEntity['id']): Promise<Responses> => {

                if (!id) return { success: false, message: 'Please provide a valid CordX User Cornflake' };

                const user = await this.client.db.prisma.userEntity.findFirst({ where: { entityId: id } });

                if (!user) return { success: false, message: 'User not found' };

                return { success: true, data: user };
            }
        }
    }
}