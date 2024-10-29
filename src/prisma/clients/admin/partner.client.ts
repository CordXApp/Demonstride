import { PartnerMethods, Responses } from '@types/database/index';
import type CordX from '@/client';

interface Partners {
    name: string;
    image: string;
    bio: string;
    url: string;
    social: string;
}

export class PartnerClient implements PartnerMethods {

    private client: CordX;

    constructor(client: CordX) {
        this.client = client;
    }

    public get model(): PartnerMethods {
        return {

            /**
             * Create a new partner in the database.
             * @param data The data to create the partner with.
             * @returns The response from the database.
             */
            create: async (data: Partners): Promise<Responses> => {

                if (!data) return { success: false, message: 'Please provide the required data.' };
                if (!data.name) return { success: false, message: 'Please provide a name for the partner.' };
                if (!data.image) return { success: false, message: 'Please provide an image for the partner.' };
                if (!data.bio) return { success: false, message: 'Please provide a bio for the partner.' };
                if (!data.url) return { success: false, message: 'Please provide a url for the partner.' };
                if (!data.social) return { success: false, message: 'Please provide social links for the partner ' };

                const check = await this.client.db.prisma.partners.findFirst({ where: { name: data.name } });

                if (check) return { success: false, message: 'A partner with that name already exists.' };

                const partner = await this.client.db.prisma.partners.create({ data });

                if (!partner) return { success: false, message: 'An error occurred while creating the partner.' };

                return { success: true, data: partner };
            },

            list: async (): Promise<Responses> => {
                const partners = await this.client.db.prisma.partners.findMany();

                if (!partners) return { success: false, message: 'No partners found, please try again later.' };

                return { success: true, data: partners };
            }
        }
    }
}