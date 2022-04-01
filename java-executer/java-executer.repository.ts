
export class JavaExecuterRepository {
    private static _instance: JavaExecuterRepository;

    public static async getInstance(): Promise<JavaExecuterRepository> {
        if (JavaExecuterRepository._instance === undefined) {
            JavaExecuterRepository._instance = new JavaExecuterRepository();
        }
        return JavaExecuterRepository._instance;
    }

}
