import { app } from "./app";
import { initDb } from "./db/initDb";

const PORT = 3000;

async function bootstrap() {
    try {
        await initDb();
        
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Fatal startup error:", err);
        process.exit(1);
    }
}

bootstrap();