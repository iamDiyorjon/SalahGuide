import React, { useState } from 'react';

const NamozApp = () => {
  const [selectedNamoz, setSelectedNamoz] = useState('');
  const [joinedRakat, setJoinedRakat] = useState('');
  const [joinedPosition, setJoinedPosition] = useState('');
  const [showResult, setShowResult] = useState(false);

  const namozlar = {
    bomdod: { nom: 'Bomdod', rakatSoni: 2 },
    peshin: { nom: 'Peshin', rakatSoni: 4 },
    asr: { nom: 'Asr', rakatSoni: 4 },
    shom: { nom: 'Shom', rakatSoni: 3 },
    xufton: { nom: 'Xufton', rakatSoni: 4 }
  };

  const holatlar = {
    qiyom: 'Rukudan oldin qoshildim',
    ruku: 'Rukudan keyin qoshildim'
  };

  const calculateResult = () => {
    if (!selectedNamoz || !joinedRakat || !joinedPosition) return null;

    const namoz = namozlar[selectedNamoz];
    const rakatNum = parseInt(joinedRakat);
    
    let imomBilanOqildi = 0;
    
    // Fixed calculation logic for joining after ruku
    if (joinedPosition === 'qiyom') {
      // Joined before ruku - this rakat counts
      imomBilanOqildi = namoz.rakatSoni - rakatNum + 1;
    } else if (joinedPosition === 'ruku') {
      // Joined after ruku - this rakat doesn't count, it's missed
      imomBilanOqildi = namoz.rakatSoni - rakatNum;
    }

    const qolganRakatlar = namoz.rakatSoni - imomBilanOqildi;
    
    if (qolganRakatlar <= 0) {
      return {
        namozNomi: namoz.nom,
        qolganRakatlar: 0,
        tugallangan: true,
        qoshilganHolat: `${rakatNum}-rakatda ${holatlar[joinedPosition]}`
      };
    }
    
    const yoriqnomalar = [];
    
    // Calculate which actual rakats of the prayer the person is completing
    const missedRakats = rakatNum - 1 + (joinedPosition === 'ruku' ? 1 : 0);
    
    for (let i = 1; i <= qolganRakatlar; i++) {
      // This is the actual rakat number in the prayer sequence
      const actualRakatNumber = i + (namoz.rakatSoni - qolganRakatlar);
      
      // For personal rakat counting (for tashahhud and recitation rules)
      // This tracks how many rakats the person has personally completed
      let personalRakatCount = i + imomBilanOqildi;
      
      let instruction = {
        rakatRaqami: i,
        actualRakatNumber: actualRakatNumber,
        personalRakatCount: personalRakatCount,
        qiroat: '',
        otirish: false
      };

      if (selectedNamoz === 'bomdod') {
        instruction.qiroat = 'Fotiha + Sura (ovoz chiqarib)';
        if (i === qolganRakatlar) instruction.otirish = true;
      } else if (selectedNamoz === 'shom') {
        // For Shom (Maghrib) - first 2 rakats have Fatiha+Sura, 3rd has only Fatiha
        if (personalRakatCount <= 2) {
          instruction.qiroat = 'Fotiha + Sura';
        } else {
          instruction.qiroat = 'Faqat Fotiha';
        }
        // Sit for tashahhud after 2nd personal rakat if there are more rakats remaining
        if (personalRakatCount === 2 && qolganRakatlar > i) instruction.otirish = true;
        // Always sit in the final rakat
        if (i === qolganRakatlar) instruction.otirish = true;
      } else {
        // For 4-rakat prayers (Peshin, Asr, Xufton)
        // First 2 rakats in any namaz have Fatiha + Sura, last 2 have only Fatiha
        // But for late joiners, we count their personal rakats, not prayer sequence
        
        // Count how many rakats this person has completed in their own sequence
        let personalSequenceRakat = i;
        
        if (personalSequenceRakat <= 2) {
          instruction.qiroat = 'Fotiha + Sura';
        } else {
          instruction.qiroat = 'Faqat Fotiha';
        }
        
        // Sit for tashahhud after completing 2nd personal rakat (which is 1st remaining rakat for rukū joiners)
        if (personalRakatCount === 2 && qolganRakatlar > 1) instruction.otirish = true;
        // Always sit in the final rakat
        if (i === qolganRakatlar) instruction.otirish = true;
      }

      yoriqnomalar.push(instruction);
    }

    return {
      namozNomi: namoz.nom,
      qolganRakatlar: qolganRakatlar,
      yoriqnomalar: yoriqnomalar,
      tugallangan: false,
      qoshilganHolat: `${rakatNum}-rakatda ${holatlar[joinedPosition]}`,
      imomBilanOqildi: imomBilanOqildi,
      missedRakats: missedRakats
    };
  };

  const result = calculateResult();

  const handleSubmit = () => {
    if (selectedNamoz && joinedRakat && joinedPosition) {
      setShowResult(true);
    }
  };

  const reset = () => {
    setSelectedNamoz('');
    setJoinedRakat('');
    setJoinedPosition('');
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Namozga Kech Qoshilganlar Uchun Yoriqnoma
          </h1>
          <p className="text-gray-600">
            Namozga kech qoshilganingizdan keyin qanday davom etishni bilib oling
          </p>
        </div>

        {!showResult ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Namoz turini tanlang:
                </label>
                <select 
                  value={selectedNamoz}
                  onChange={(e) => setSelectedNamoz(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Namoz turini tanlang...</option>
                  {Object.entries(namozlar).map(([key, namoz]) => (
                    <option key={key} value={key}>
                      {namoz.nom} namozi ({namoz.rakatSoni} rakat)
                    </option>
                  ))}
                </select>
              </div>

              {selectedNamoz && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qaysi rakatda qoshildingiz?
                  </label>
                  <select 
                    value={joinedRakat}
                    onChange={(e) => setJoinedRakat(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Rakatni tanlang...</option>
                    {Array.from({length: namozlar[selectedNamoz].rakatSoni}, (_, i) => (
                      <option key={i+1} value={i+1}>
                        {i+1}-rakat
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {joinedRakat && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qaysi holatda qoshildingiz?
                  </label>
                  <div className="space-y-2">
                    {Object.entries(holatlar).map(([key, holat]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="radio"
                          name="position"
                          value={key}
                          checked={joinedPosition === key}
                          onChange={(e) => setJoinedPosition(e.target.value)}
                          className="mr-3 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-gray-700">{holat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedNamoz && joinedRakat && joinedPosition && (
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                >
                  Yoriqnomani Korsatish
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {result && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Sizning Yoriqnomangiz
                  </h2>
                  <button
                    onClick={reset}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Qaytadan
                  </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <p className="text-blue-800">
                    <strong>{result.namozNomi} namozi:</strong> {result.qoshilganHolat}
                  </p>
                </div>

                {result.tugallangan ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4">
                      Tabriklaymiz!
                    </h3>
                    <p className="text-green-700 text-lg mb-4">
                      Siz imom bilan barcha rakatlarni oqib bolgansiz
                    </p>
                    <p className="text-green-600">
                      Imom salom berganidan keyin boshqa hech narsa qilishingiz shart emas
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Imom salom berganidan keyin {result.qolganRakatlar} rakat oqishingiz kerak:
                      </h3>

                      <div className="space-y-4">
                        {result.yoriqnomalar.map((instruction, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start space-x-4">
                              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                {instruction.rakatRaqami}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 mb-2">
                                  {instruction.rakatRaqami}-rakat:
                                </h4>
                                <p className="text-gray-600 mb-2">
                                  <strong>Qiroat:</strong> {instruction.qiroat}
                                </p>
                                {instruction.otirish && (
                                  <p className="text-green-600 font-medium">
                                    Tashahhud oqib otiring
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">Eslatma:</h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Barcha rakatlarni yakunlaganingizdan keyin tashahhud va salom bering</li>
                        <li>• Agar shubhangiz bolsa, namozni qaytadan oqing</li>
                        <li>• Doimo Alloh taoloning roziligi uchun namoz oqing</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Alloh taolo namozimizni qabul qilsin!</p>
        </div>
      </div>
    </div>
  );
};

export default NamozApp;