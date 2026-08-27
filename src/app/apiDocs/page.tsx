export default function ApiDocsPage() {
    return (
        <main className="min-h-screen bg-[#EDFAF9] px-6 py-10">
            <div className="mx-auto max-w-6xl">

                <h1 className="mb-2 text-3xl font-bold text-[#163536]">
                    API dokumentacija
                </h1>

                <p className="mb-8 text-[#527273]">
                    Swagger/OpenAPI dokumentacija aplikacije Belgrade Events.
                </p>

                <div className="overflow-hidden rounded-2xl border border-[#2EC4B6]/30 bg-white shadow-sm">
                    <iframe
                        src="/swagger.html"
                        title="Swagger API dokumentacija"
                        className="h-[1000px] w-full border-0"
                    />
                </div>

            </div>
        </main>
    );
}