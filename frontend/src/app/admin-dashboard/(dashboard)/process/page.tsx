import ProcessManager from './ProcessManager';

async function getProcessSteps() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/process/', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getProcessPageConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/process-config/current/', {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function ProcessAdminPage() {
  const [steps, config] = await Promise.all([
    getProcessSteps(),
    getProcessPageConfig()
  ]);

  return (
    <div className="py-4">
      <ProcessManager initialSteps={steps} initialConfig={config} />
    </div>
  );
}
