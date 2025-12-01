// export default MainPage(){
//     return(
//         <div id="app-dashboard" class="hidden">

//       <main class="pt-24 px-4 container mx-auto max-w-md">
//         <div id="page-home" class="page-section fade-in">
//           <div class="flex justify-between items-start mb-6">
//             <div>
//               <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
//                 Hai,
//                 <span
//                   id="home-username"
//                   class="text-gray-900 dark:text-white font-bold"
//                   >User</span
//                 >!
//               </p>
//               <h2 class="text-2xl font-extrabold text-gray-800 dark:text-white">
//                 Ayo Sehat! 🥑
//               </h2>
//             </div>
//             <div class="flex flex-col items-end">
//               <div
//                 class="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-orange-200 dark:border-orange-800 mb-1"
//               >
//                 <i class="fas fa-fire text-orange-500 animate-pulse"></i>
//                 <span id="streak-count">0</span> Hari
//               </div>
//               <div class="flex gap-1">
//                 <div class="w-2 h-2 rounded-full bg-orange-400"></div>
//                 <div class="w-2 h-2 rounded-full bg-orange-400"></div>
//                 <div class="w-2 h-2 rounded-full bg-orange-400"></div>
//                 <div
//                   class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"
//                 ></div>
//                 <div
//                   class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"
//                 ></div>
//               </div>
//             </div>
//           </div>

//           <div
//             class="mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-[2rem] text-white shadow-lg relative overflow-hidden"
//           >
//             <div class="relative z-10">
//               <div class="flex items-center gap-2 mb-2">
//                 <span
//                   class="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur"
//                   >DIGITAL METABOLISM</span
//                 >
//               </div>
//               <p
//                 class="text-sm opacity-90 leading-relaxed"
//                 id="medical-context"
//               >
//                 Halo! Berdasarkan data fisikmu, tubuhmu butuh asupan spesifik.
//               </p>
//               <div class="mt-3 flex gap-3">
//                 <div class="bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl">
//                   <p class="text-[10px] opacity-75">Target Kalori</p>
//                   <p class="font-bold" id="ctx-cal">2000</p>
//                 </div>
//                 <div class="bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl">
//                   <p class="text-[10px] opacity-75">Berat Ideal</p>
//                   <p class="font-bold" id="ctx-ideal">68 kg</p>
//                 </div>
//               </div>
//             </div>
//             <i
//               class="fas fa-dna absolute -bottom-4 -right-4 text-8xl text-white opacity-10"
//             ></i>
//           </div>

//           <div
//             class="bg-white dark:bg-darkCard rounded-[2rem] p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700"
//           >
//             <div class="flex justify-between items-center mb-6">
//               <div>
//                 <span class="text-sm text-gray-400">Sisa Kalori Harian</span>
//                 <div class="flex items-baseline gap-1">
//                   <span
//                     class="text-4xl font-bold tracking-tight text-gray-800 dark:text-white"
//                     id="home-remaining-cals"
//                     >0</span
//                   ><span class="text-sm font-medium text-gray-400">kkal</span>
//                 </div>
//               </div>
//               <div class="relative w-16 h-16 flex items-center justify-center">
//                 <svg class="w-full h-full transform -rotate-90">
//                   <circle
//                     cx="32"
//                     cy="32"
//                     r="28"
//                     stroke="#e2e8f0"
//                     stroke-width="6"
//                     fill="none"
//                   />
//                   <circle
//                     id="cal-circle"
//                     cx="32"
//                     cy="32"
//                     r="28"
//                     stroke="#58CC02"
//                     stroke-width="6"
//                     fill="none"
//                     stroke-dasharray="175"
//                     stroke-dashoffset="175"
//                     stroke-linecap="round"
//                   /></svg
//                 ><i class="fas fa-utensils text-gray-400 absolute text-sm"></i>
//               </div>
//             </div>
//             <div class="grid grid-cols-3 gap-3">
//               <div class="bg-gray-50 dark:bg-slate-800 rounded-xl p-2.5">
//                 <p class="text-[10px] text-gray-400 uppercase font-bold">
//                   Protein
//                 </p>
//                 <p class="font-bold text-base dark:text-white" id="home-pro">
//                   0g
//                 </p>
//                 <div class="w-full bg-gray-200 h-1 rounded-full mt-1">
//                   <div
//                     id="bar-pro"
//                     class="bg-blue-400 h-1 rounded-full"
//                     style="width: 0%"
//                   ></div>
//                 </div>
//               </div>
//               <div class="bg-gray-50 dark:bg-slate-800 rounded-xl p-2.5">
//                 <p class="text-[10px] text-gray-400 uppercase font-bold">
//                   Karbo
//                 </p>
//                 <p class="font-bold text-base dark:text-white" id="home-car">
//                   0g
//                 </p>
//                 <div class="w-full bg-gray-200 h-1 rounded-full mt-1">
//                   <div
//                     id="bar-car"
//                     class="bg-yellow-400 h-1 rounded-full"
//                     style="width: 0%"
//                   ></div>
//                 </div>
//               </div>
//               <div class="bg-gray-50 dark:bg-slate-800 rounded-xl p-2.5">
//                 <p class="text-[10px] text-gray-400 uppercase font-bold">
//                   Lemak
//                 </p>
//                 <p class="font-bold text-base dark:text-white" id="home-fat">
//                   0g
//                 </p>
//                 <div class="w-full bg-gray-200 h-1 rounded-full mt-1">
//                   <div
//                     id="bar-fat"
//                     class="bg-red-400 h-1 rounded-full"
//                     style="width: 0%"
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div class="mb-6">
//             <div class="flex justify-between items-center mb-3">
//               <h3 class="font-bold text-lg text-gray-800 dark:text-white">
//                 Menu Hari Ini
//               </h3>
//               <button
//                 onclick="generateMealPlan()"
//                 class="text-primary text-xs font-bold uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition"
//               >
//                 <i class="fas fa-magic mr-1"></i> Buat Menu
//               </button>
//             </div>
//             <div id="meal-plan-container" class="space-y-3">
//               <div
//                 class="p-6 text-center text-gray-400 text-sm bg-white dark:bg-darkCard rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
//               >
//                 Belum ada rencana makan.
//               </div>
//             </div>
//           </div>

//           <div
//             onclick="startScanFlow()"
//             class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer btn-press group mb-20 relative overflow-hidden"
//           >
//             <div
//               class="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
//             ></div>
//             <div
//               class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl"
//             >
//               <i class="fas fa-camera"></i>
//             </div>
//             <div class="flex-1">
//               <h4 class="font-bold text-lg">AI Nutrition Scan</h4>
//               <p class="text-xs opacity-80">Analisis makro & cegah obesitas</p>
//             </div>
//             <i class="fas fa-chevron-right opacity-50"></i>
//           </div>
//         </div>

//         <div id="page-stats" class="page-section hidden fade-in">
//           <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
//             Analisis Data
//           </h2>
//           <div class="flex flex-col gap-4 mb-6">
//             <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex gap-1">
//               <button
//                 onclick="updateStatsView('calorie')"
//                 id="stat-tab-cal"
//                 class="flex-1 py-2 rounded-lg text-sm font-bold bg-white text-primary shadow-sm transition"
//               >
//                 Kalori
//               </button>
//               <button
//                 onclick="updateStatsView('weight')"
//                 id="stat-tab-wei"
//                 class="flex-1 py-2 rounded-lg text-sm font-bold text-gray-500 transition"
//               >
//                 Berat Badan
//               </button>
//             </div>
//             <div class="flex justify-end">
//               <select
//                 id="stat-period"
//                 onchange="renderCharts()"
//                 class="bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-xs font-bold"
//               >
//                 <option value="daily">Harian</option>
//                 <option value="weekly">Mingguan</option>
//                 <option value="monthly">Bulanan</option>
//               </select>
//             </div>
//           </div>
//           <div
//             class="bg-white dark:bg-darkCard p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
//           >
//             <div style="position: relative; height: 250px; width: 100%">
//               <canvas id="mainChart"></canvas>
//             </div>
//           </div>
//           <div
//             class="bg-white dark:bg-darkCard p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
//           >
//             <h3 class="font-bold text-sm mb-3 text-gray-500 uppercase">
//               Input Berat Badan
//             </h3>
//             <div class="flex gap-3">
//               <input
//                 type="number"
//                 id="quick-weight-input"
//                 placeholder="Contoh: 65.5"
//                 class="input-style flex-1 border border-gray-200"
//               /><button
//                 onclick="updateWeight()"
//                 class="bg-secondary text-white px-5 py-2 rounded-xl font-bold btn-press shadow-lg shadow-blue-500/30"
//               >
//                 Simpan
//               </button>
//             </div>
//           </div>
//           <h3 class="font-bold text-lg mb-3" id="history-title">Riwayat</h3>
//           <div id="history-list" class="space-y-2"></div>
//         </div>

//         <div id="page-library" class="page-section hidden fade-in pb-20">
//           <div class="sticky top-24 bg-surface dark:bg-darkBg z-30 pb-4 pt-2">
//             <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
//               Pustaka Pintar
//             </h2>
//             <div class="flex gap-2 overflow-x-auto hide-scroll">
//               <button
//                 onclick="renderLibrary('all')"
//                 class="px-5 py-2 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-green-500/30 whitespace-nowrap"
//               >
//                 Untukmu
//               </button>
//               <button
//                 onclick="renderLibrary('recipe')"
//                 class="px-5 py-2 rounded-full bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 font-bold text-sm whitespace-nowrap"
//               >
//                 Resep
//               </button>
//               <button
//                 onclick="renderLibrary('article')"
//                 class="px-5 py-2 rounded-full bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 font-bold text-sm whitespace-nowrap"
//               >
//                 Olahraga
//               </button>
//               <button
//                 onclick="renderLibrary('saved')"
//                 class="px-5 py-2 rounded-full bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 font-bold text-sm whitespace-nowrap text-secondary"
//               >
//                 <i class="fas fa-bookmark mr-1"></i> Disimpan
//               </button>
//             </div>
//           </div>
//           <div id="library-content" class="grid grid-cols-2 gap-4"></div>
//         </div>

//         <div id="page-chat" class="page-section hidden h-[85vh] flex flex-col">
//           <div
//             class="bg-gradient-to-r from-secondary to-blue-600 p-6 rounded-b-[2rem] shadow-lg mb-4 text-white"
//           >
//             <div class="flex items-center gap-4">
//               <div
//                 class="mascot-avatar bg-white/20 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-md text-2xl"
//               >
//                 🤖
//               </div>
//               <div>
//                 <h3 class="font-bold text-lg">Alvi Assistant</h3>
//                 <p class="text-xs opacity-90">Konsultan Diet Pribadi</p>
//               </div>
//             </div>
//           </div>
//           <div id="chat-box" class="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
//             <div class="flex gap-3">
//               <div
//                 class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold"
//               >
//                 AI
//               </div>
//               <div
//                 class="bg-white dark:bg-darkCard p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-gray-100 dark:border-gray-700 max-w-[80%]"
//               >
//                 Halo! Saya Alvi. Ada yang bisa saya bantu terkait target berat
//                 badanmu?
//               </div>
//             </div>
//           </div>
//           <div
//             class="p-4 bg-white dark:bg-darkCard border-t border-gray-200 dark:border-gray-700"
//           >
//             <div
//               class="flex gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
//             >
//               <input
//                 type="text"
//                 id="chat-input"
//                 placeholder="Tulis pesan..."
//                 class="bg-transparent flex-1 px-3 outline-none text-sm dark:text-white"
//               /><button
//                 onclick="sendMessage()"
//                 class="w-10 h-10 bg-secondary rounded-full text-white flex items-center justify-center shadow-lg"
//               >
//                 <i class="fas fa-paper-plane"></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div id="page-profile" class="page-section hidden fade-in">
//           <div class="text-center mb-8 pt-4">
//             <div
//               class="w-28 h-28 mx-auto bg-gray-200 rounded-full p-1 border-4 border-white dark:border-gray-700 shadow-xl mb-3 overflow-hidden"
//             >
//               <img
//                 src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
//                 class="w-full h-full object-cover"
//               />
//             </div>
//             <h2 class="text-2xl font-bold dark:text-white" id="profile-name">
//               User Name
//             </h2>
//             <p class="text-sm text-primary font-bold">Health Warrior</p>
//           </div>
//           <div class="space-y-4">
//             <div
//               class="bg-white dark:bg-darkCard rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer btn-press"
//               onclick="openOnboarding()"
//             >
//               <div class="flex items-center gap-4">
//                 <div
//                   class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"
//                 >
//                   <i class="fas fa-ruler-combined"></i>
//                 </div>
//                 <div>
//                   <h4 class="font-bold text-sm">Data Fisik & Target</h4>
//                   <p class="text-xs text-gray-500">
//                     Ubah berat, tinggi, dan tujuan
//                   </p>
//                 </div>
//               </div>
//               <i class="fas fa-chevron-right text-gray-300"></i>
//             </div>
//             <button
//               onclick="location.reload()"
//               class="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl mt-4 border border-red-100 hover:bg-red-100 transition"
//             >
//               Keluar Akun
//             </button>
//           </div>
//         </div>
//       </main>

//     </div>
//     )
// }
