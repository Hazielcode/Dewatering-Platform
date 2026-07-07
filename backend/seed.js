import { query } from './src/config/db.js';
query("INSERT INTO leads (company_name, contact_name, contact_email, service_interest, status, created_at) VALUES ('Minera Chinalco', 'Carlos Mendoza', 'cmendoza@chinalco.com', 'Filtros Prensa', 'NEW', NOW())").then(() => {
    console.log('Lead Seeded!');
    process.exit(0);
}).catch(console.error);
