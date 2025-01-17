/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface CDNFilesSchema {
    /**
     * A list of all files and directories in the CDN.
     */
    files?: File[]
    [k: string]: unknown
}
export interface File {
    /**
     * The name of the file or directory.
     */
    name: string
    /**
     * Indicates if the item is a directory.
     */
    isDirectory: boolean
    /**
     * The relative path to the file or directory.
     */
    path: string
    /**
     * The list of files and directories within this directory (if it is a directory).
     */
    children?: File[]
    [k: string]: unknown
}
