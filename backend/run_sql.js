import pool from './src/config/db.js';

const run = async () => {
  try {
    console.log("Creando tablas y buckets...");
    await pool.query(`
      -- 1. Crear un Bucket público para los documentos de IA
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('dewatering-documents', 'dewatering-documents', true)
      ON CONFLICT (id) DO NOTHING;
      
      -- 2. Permitir que cualquiera pueda ver y descargar los documentos (Políticas de Seguridad)
      -- Estas políticas pueden dar error si ya existen, por eso el bloque se maneja con cuidado
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage'
        ) THEN
            CREATE POLICY "Public Access" 
            ON storage.objects FOR SELECT 
            USING ( bucket_id = 'dewatering-documents' );
        END IF;
      END
      $$;
      
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE policyname = 'Insert Access' AND tablename = 'objects' AND schemaname = 'storage'
        ) THEN
            CREATE POLICY "Insert Access" 
            ON storage.objects FOR INSERT 
            WITH CHECK ( bucket_id = 'dewatering-documents' );
        END IF;
      END
      $$;
      
      -- 3. Tabla para controlar la "Cola de Tareas" (Jobs) de la IA
      CREATE TABLE IF NOT EXISTS ai_training_jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          file_name VARCHAR(255) NOT NULL,
          file_url TEXT NOT NULL,          -- El link al Supabase Storage
          status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING | EXTRACTING | EMBEDDING | COMPLETED | FAILED
          progress INT DEFAULT 0,          -- Para la barra de progreso (0 a 100)
          error_message TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ
      );
    `);
    console.log("¡Todo listo! Las tablas y los buckets se han creado exitosamente.");
    process.exit(0);
  } catch (err) {
    console.error("Error al ejecutar SQL:", err);
    process.exit(1);
  }
};

run();
