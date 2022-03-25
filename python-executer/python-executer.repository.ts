
export class PythonExecuterRepository {
    private static _instance: PythonExecuterRepository;

    public static async getInstance(): Promise<PythonExecuterRepository> {
        if (PythonExecuterRepository._instance === undefined) {
            PythonExecuterRepository._instance = new PythonExecuterRepository();
        }
        return PythonExecuterRepository._instance;
    }

}
