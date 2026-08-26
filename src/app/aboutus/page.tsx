export default function AboutPage() {
    return (
        <main className="min-h-screen bg-sky-50">
            <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:py-16">

                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-teal-600 sm:text-5xl">
                        O nama
                    </h1>

                    <p className="mt-4 text-lg text-slate-600 sm:text-xl">
                        Saznajte više o sajtu Moj Beograd i ideji koja stoji iza njega.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl rounded-3xl border border-sky-100 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">

                    <div className="space-y-7 text-base leading-8 text-slate-600 sm:text-lg">

                        <p>
                            <strong className="font-semibold text-slate-800">
                                Moj Beograd
                            </strong>{" "}
                            je mesto na kojem možete brzo i jednostavno da pronađete
                            informacije o aktuelnim kulturnim događajima u Beogradu.
                        </p>

                        <p>
                            Na sajtu možete otkriti{" "}
                            <strong className="font-semibold text-slate-800">
                                pozorišne predstave, filmske projekcije u bioskopima,
                                muzičke događaje
                            </strong>{" "}
                            i druge sadržaje koji obogaćuju kulturni život grada.
                            Naš cilj je da vam na jednom mestu pružimo relevantne,
                            pregledne i tačne informacije kako biste lakše pronašli
                            događaj koji odgovara vašim interesovanjima.
                        </p>

                        <p>
                            Bilo da planirate odlazak u pozorište, želite da pogledate
                            novi film ili tražite muzički događaj,{" "}
                            <strong className="font-semibold text-slate-800">
                                Moj Beograd
                            </strong>{" "}
                            vam pomaže da saznate{" "}
                            <strong className="font-semibold text-slate-800">
                                šta se dešava, gde i kada.
                            </strong>
                        </p>

                        <div className="pt-6">
                            <h2 className="mb-5 text-2xl font-bold text-slate-800 sm:text-3xl">
                                Ko stoji iza sajta?
                            </h2>

                            <div className="space-y-6">
                                <p>
                                    Sajt{" "}
                                    <strong className="font-semibold text-slate-800">
                                        Moj Beograd
                                    </strong>{" "}
                                    kreirala je{" "}
                                    <strong className="font-semibold text-slate-800">
                                        Milica Đurović
                                    </strong>{" "}
                                    sa željom da ljubiteljima kulture olakša
                                    pronalaženje zanimljivih događaja u Beogradu.
                                </p>

                                <p>
                                    Ideja sajta je jednostavna – kulturna dešavanja
                                    treba da budu lako dostupna svima. Zato{" "}
                                    <strong className="font-semibold text-slate-800">
                                        Moj Beograd
                                    </strong>{" "}
                                    nastoji da posetiocima omogući da do relevantnih
                                    informacija dođu{" "}
                                    <strong className="font-semibold text-slate-800">
                                        brzo, jednostavno i tačno.
                                    </strong>
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-sky-100 pt-7">
                            <p className="text-center text-lg font-semibold text-teal-600 sm:text-xl">
                                Pronađite događaj. Istražite grad. Doživite svoj Beograd.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}