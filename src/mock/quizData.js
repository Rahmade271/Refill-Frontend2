export const MOCK_QUIZ_DATA = [
    {
        id: 'q1',
        question: 'Dalam Multi-Head Attention, output dari setiap head digabungkan (concatenated) sebelum diproyeksikan. Apa hasil dari proses concatenation ini?',
        pre_hint: 'Matriks hasil penggabungan (concatenation) menyatukan informasi dari tiap head sebelum melalui proyeksi linear.',
        options: [
            { 
                id: 'a', 
                text: 'Sebuah vektor berdimensi kecil (reduced-dimension vector).', 
                is_correct: false, 
                feedback: 'Salah: Ini adalah hasil dari proyeksi linear, bukan concatenation.' 
            },
            { 
                id: 'b', 
                text: 'Sebuah matriks yang menggabungkan informasi (matriks besar).', 
                is_correct: true, 
                feedback: 'Benar. Concatenation menghasilkan matriks gabungan dari semua head.' 
            },
            { 
                id: 'c', 
                text: 'Satu nilai tunggal yang merepresentasikan skor akhir.', 
                is_correct: false, 
                feedback: 'Salah: Skor akhir berupa nilai skalar tunggal.' 
            },
            { 
                id: 'd', 
                text: 'Matriks yang merupakan hasil perkalian Query dan Key.', 
                is_correct: true, 
                feedback: 'Benar. Output concatenation adalah gabungan hasil Value dari setiap head.' 
            },
        ],
    },
    {
        id: 'q2',
        question: 'Manakah dari komponen berikut yang termasuk dalam sub-lapisan Multi-Head Attention dalam arsitektur Transformer?',
        pre_hint: 'Sub-lapisan perhatian terdiri dari Query, Key, dan Value, yang diproyeksikan melalui linear layer. Hasil akhirnya di-normalize.',
        options: [
            { 
                id: 'a', 
                text: 'Feed Forward Network (FFN)', 
                is_correct: false, 
                feedback: 'Salah: FFN adalah sub-lapisan terpisah setelah Multi-Head Attention.' 
            },
            { 
                id: 'b', 
                text: 'Proyeksi Linear untuk Q, K, V', 
                is_correct: true, 
                feedback: 'Benar. Proyeksi input Q, K, V dilakukan sebelum perhitungan perhatian.' 
            },
            { 
                id: 'c', 
                text: 'Dropout (untuk regularisasi)', 
                is_correct: true, 
                feedback: 'Benar. Dropout biasanya digunakan dalam sub-lapisan Transformer.' 
            },
            { 
                id: 'd', 
                text: 'Add & Norm (Residual Connection dan Layer Normalization)', 
                is_correct: true, 
                feedback: 'Benar. Ini adalah langkah wajib setelah setiap sub-lapisan utama.' 
            },
        ],
    },
    {
        id: 'q3',
        question: 'Ketika sebuah token dalam urutan input memiliki fokus perhatian yang tinggi (High Attention Score), apa implikasinya dalam proses encoding?',
        pre_hint: 'Token dengan skor perhatian tinggi menunjukkan bahwa token tersebut sangat relevan atau penting untuk memahami token yang sedang diproses.',
        options: [
            { 
                id: 'a', 
                text: 'Token tersebut akan mendapatkan representasi (vektor) yang lebih kaya.', 
                is_correct: true, 
                feedback: 'Benar. Vektor Value dari token tersebut akan memiliki bobot yang lebih besar.' 
            },
            { 
                id: 'b', 
                text: 'Token tersebut akan diabaikan (masked) dalam perhitungan selanjutnya.', 
                is_correct: false, 
                feedback: 'Salah. Token yang diabaikan (masked) skornya disetel ke nilai negatif tak terhingga.' 
            },
            { 
                id: 'c', 
                text: 'Koneksi ke token lain dalam urutan tersebut diperkuat.', 
                is_correct: true, 
                feedback: 'Benar. Skor perhatian tinggi berarti ada hubungan kontekstual yang kuat.' 
            },
            { 
                id: 'd', 
                text: 'Nilai token (Value) tersebut akan dikalikan dengan skor yang lebih rendah.', 
                is_correct: false, 
                feedback: 'Salah. Nilai token dikalikan dengan skor yang lebih tinggi.' 
            },
        ],
    },
];

// data awal state kuis yang akan disimpan di Local Storage
export const INITIAL_QUIZ_STATE = {
    questions: MOCK_QUIZ_DATA,
    answers: {}, 
    checkedStatus: {}, 
    isCompleted: false,
    score: 0,
};