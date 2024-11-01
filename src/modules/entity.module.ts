import type CordX from '@/client';
import { Responses } from '@/types/database';
import { CreateEntityParams, CreateSignatureParams, CreateUserParams, EntityHandler } from '@/types/entitites';
import { EntityType } from '@prisma/client';
import Logger from '@utils/logger.util';

export class EntityModule implements EntityHandler {
    private cordx: CordX;
    private logs: Logger;

    constructor(cordx: CordX) {
        this.cordx = cordx;
        this.logs = new Logger('Demonstride:Entity_Module');
    }

    /**
     * Entity creation methods
     * @returns { EntityHandler }
     * @memberof EntityModule
     */
    public get create(): EntityHandler['create'] {
        return {
            /**
             * Create a new entity!
             * @param cornflake The cornflake of the entity
             * @param domain The domain of the entity
             * @param type The type of the entity (USER | ORG)
             * @returns { Promise<Responses> }
             */
            entity: async (params: CreateEntityParams): Promise<Responses> => {
                const { cornflake, domain, type } = params;

                if (!cornflake || !domain || !type) {
                    const missingParam = !cornflake ? 'Cornflake' : !domain ? 'Domain' : 'Type';
                    this.logs.error(`Missing parameter: ${missingParam}`);
                    return {
                        success: false,
                        message: `Missing parameter: ${missingParam}`
                    };
                }

                try {
                    await this.cordx.db.prisma.entity.create({
                        data: {
                            id: cornflake,
                            type: type === 'USER' ? EntityType.USER : EntityType.ORG,
                            domain: domain
                        }
                    });

                    this.logs.info(`Successfully created entity with Cornflake: ${cornflake}`);
                    return {
                        success: true,
                        message: `Successfully created entity with Cornflake: ${cornflake}`
                    };
                } catch (error: any) {
                    this.logs.error(`Failed to create entity: ${error.message}`);
                    return {
                        success: false,
                        message: `Failed to create entity: ${error.message}`
                    };
                }
            },

            /**
             * Create a new Auth Signature (Used for User Authentication)
             * @param cornflake The cornflake of the entity
             * @param signature The signature of the entity
             * @returns { Promise<Responses> }
             */
            signature: async (params: CreateSignatureParams): Promise<Responses> => {
                const { cornflake, signature } = params;

                if (!cornflake || !signature) {
                    const missingParam = !cornflake ? 'Cornflake' : 'Signature';
                    this.logs.error(`Missing parameter: ${missingParam}`);
                    return {
                        success: false,
                        message: `Missing parameter: ${missingParam}`
                    };
                }

                try {
                    await this.cordx.db.prisma.userEntitySignatures.create({
                        data: {
                            id: cornflake,
                            key: signature
                        }
                    });

                    this.logs.info(`Successfully created auth signature for entity: ${cornflake}`);
                    return {
                        success: true,
                        message: `Successfully created auth signature for entity: ${cornflake}`
                    };
                } catch (error: any) {
                    this.logs.error(`Failed to create auth signature: ${error.message}`);
                    return {
                        success: false,
                        message: `Failed to create auth signature: ${error.message}`
                    };
                }
            },

            /**
             * Create a new User Entity
             * @param avatar The avatar of the entity
             * @param banner The banner of the entity
             * @param username The username of the entity
             * @param globalName The global name of the entity
             * @param entityId The entity ID of the entity
             * @param userid The user ID of the entity
             * @param folder The folder of the entity
             * @returns { Promise<Responses> }
             */
            user: async (params: CreateUserParams): Promise<Responses> => {

                const { avatar, banner, username, globalName, entityId, userid, folder, signature } = params;

                if (!avatar || !banner || !username || !globalName || !entityId || !userid || !folder || !signature) {
                    const missingParam = !avatar ? 'Avatar'
                        : !banner ? 'Banner'
                            : !username ? 'Username'
                                : !globalName ? 'Global Name'
                                    : !entityId ? 'Entity ID'
                                        : !userid ? 'User ID'
                                            : !folder ? 'Folder'
                                                : 'Signature';

                    this.logs.error(`Missing parameter: ${missingParam}`);

                    return {
                        success: false,
                        message: `Missing parameter: ${missingParam}`
                    };
                }

                try {
                    await this.cordx.db.prisma.userEntity.create({
                        data: {
                            userid: userid,
                            entityId: entityId,
                            username: username,
                            globalName: globalName,
                            avatar: avatar,
                            banner: banner,
                            folder: folder,
                            entity: {
                                connectOrCreate: {
                                    where: { id: entityId },
                                    create: { id: entityId, type: EntityType.USER }
                                }
                            },
                            signature: signature ? {
                                connectOrCreate: {
                                    where: { key: signature },
                                    create: { id: entityId, key: signature }
                                }
                            } : undefined
                        }
                    });

                    this.logs.info(`Successfully created user entity with ID: ${userid}`);

                    return {
                        success: true,
                        message: `Successfully created user entity with ID: ${userid}`
                    };
                } catch (error: any) {
                    this.logs.error(`Failed to create user entity: ${error.message}`);

                    return {
                        success: false,
                        message: `Failed to create user entity: ${error.message}`
                    };
                }
            }
        };
    }
}