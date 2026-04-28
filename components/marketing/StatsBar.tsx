export function StatsBar() {
  return (
    <section className="bg-[#1C2833] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-semibold text-[#A8DADC]">7 av 10</div>
            <div className="text-gray-400 text-sm mt-1">
              norske familier mangler en skriftlig beredskapsplan
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-[#A8DADC]">72 timer</div>
            <div className="text-gray-400 text-sm mt-1">
              DSBs minimumskrav til egenberedskap
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-[#A8DADC]">+5 min</div>
            <div className="text-gray-400 text-sm mt-1">
              er nok til å starte din første beredskapsplan
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-xs text-center mt-4">
          Kilde: DSB-inspirerte estimater og offentlig tilgjengelig statistikk
        </p>
      </div>
    </section>
  );
}
