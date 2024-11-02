import { PartnerMethods, Responses } from '@/types/index';
import type CordX from '@/client';

interface Partners {
    name: string;
    image: string;
    bio: string;
    url: string;
    social: string;
}

export class PartnerClient {

    private client: CordX;

    constructor(client: CordX) {
        this.client = client;
    }

    public get model(): PartnerMethods {
        return {

            /**
             * List all partners in the database.
             * @returns The response from the database.
             */
            list: async (): Promise<Responses> => {
                const partners = await this.client.db.prisma.partners.findMany();

                if (!partners) return { success: false, message: 'No partners found.' };

                return { success: true, data: partners };
            },

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

            exists: async (id: string): Promise<boolean> => {
                if (!id) return false;

                const partner = await this.client.db.prisma.partners.findFirst({ where: { id } });

                return partner ? true : false;
            },

            /**
             * Fetch a partner from the database.
             * @param id The id of the partner to fetch.
             * @returns The response from the database.
             */
            fetch: async (id: string): Promise<Responses> => {
                if (!id) return { success: false, message: 'Please provide the id of the partner to fetch.' };

                const partner = await this.client.db.prisma.partners.findFirst({ where: { id } });

                if (!partner) return { success: false, message: 'No partner found with that id.' };

                return { success: true, data: partner };
            },

            /**
             * Update a partner in the database.
             * @param id The id of the partner to update.
             * @param data The data to update the partner with.
             * @returns The response from the database.
             */
            update: async (id: string, data: Partners): Promise<Responses> => {
                if (!id) return { success: false, message: 'Please provide the id of the partner to update.' };
                if (!data) return { success: false, message: 'Please provide the required data.' };

                const partner = await this.client.db.prisma.partners.update({ where: { id }, data });

                if (!partner) return { success: false, message: 'An error occurred while updating the partner.' };

                return { success: true, data: partner };
            },

            /**
             * Delete a partner from the database.
             * @param name The name of the partner to delete.
             * @returns The response from the database.
             */
            delete: async (id: string): Promise<Responses> => {
                if (!id) return { success: false, message: 'Please provide the id of the partner to delete.' };

                const partner = await this.client.db.prisma.partners.delete({ where: { id } });

                if (!partner) return { success: false, message: 'An error occurred while deleting the partner.' };

                return { success: true, data: partner };
            },
        }
    }
}