
export class CExecuterRepository {
    private static _instance: CExecuterRepository;

    public static async getInstance(): Promise<CExecuterRepository> {
        if (CExecuterRepository._instance === undefined) {
            CExecuterRepository._instance = new CExecuterRepository();
        }
        return CExecuterRepository._instance;
    }

}
