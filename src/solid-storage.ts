import {IStorage} from "@inrupt/solid-client-authn-node";
import {createClient} from "redis";

export class RedisSolidStorage implements IStorage {
    private client;
    private static _instance: RedisSolidStorage;

    private constructor(
        host?: string,
        port?: string,
    ) {

        const url = `redis://${host || 'localhost'}:${ port || 6379}`

        this.client = createClient({
            url,
        });

        this.client.on("error", (err: Error) => {
            throw new Error(`Error connecting to redis backend: ${err.message}`);
        });
        this.client.connect();
    }

    public static get instance(): RedisSolidStorage {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new RedisSolidStorage();
        return this._instance;
    }

    async delete(key: string): Promise<void> {
        try {
            const result = await this.client.del(key).then();
            if (result > 0) return;
            else {
                return; // ??
            }
        } catch (e) {
            return;
        }
    }

    async get(key: string): Promise<string | undefined> {
        try {
            const value = await this.client.get(key);
            return value || undefined;
        } catch (e) {
            return undefined;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            const result = await this.client.set(key, value);
            if (result == "OK") return;
        } catch (e) {
            return;
        }
    }
}
