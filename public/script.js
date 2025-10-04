        let array = [];
        let sorting = false;
        let stopped = false;
        let arraySize = 50;
        let speed = 50;

        const arrayContainer = document.getElementById('arrayContainer');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const resetBtn = document.getElementById('resetBtn');
        const algorithmSelect = document.getElementById('algorithm');
        const arraySizeInput = document.getElementById('arraySize');
        const speedInput = document.getElementById('speed');
        const sizeValue = document.getElementById('sizeValue');
        const speedValue = document.getElementById('speedValue');

        arraySizeInput.addEventListener('input', (e) => {
            arraySize = parseInt(e.target.value);
            sizeValue.textContent = arraySize;
            generateArray();
        });

        speedInput.addEventListener('input', (e) => {
            speed = parseInt(e.target.value);
            speedValue.textContent = speed + 'ms';
        });

        startBtn.addEventListener('click', startSorting);
        stopBtn.addEventListener('click', stopSorting);
        resetBtn.addEventListener('click', generateArray);

        function generateArray() {
            if (sorting) return;
            stopped = false;
            array = [];
            const containerHeight = arrayContainer.offsetHeight - 40;
            for (let i = 0; i < arraySize; i++) {
                array.push(Math.floor(Math.random() * (containerHeight - 20)) + 20);
            }
            displayArray();
        }

        function displayArray(comparingIndices = [], swappingIndices = [], sortedIndices = []) {
            arrayContainer.innerHTML = '';
            const containerWidth = arrayContainer.offsetWidth;
            const barWidth = Math.max(2, (containerWidth - (arraySize * 2)) / arraySize);
            
            array.forEach((value, index) => {
                const bar = document.createElement('div');
                bar.className = 'array-bar';
                bar.style.height = `${value}px`;
                bar.style.width = `${barWidth}px`;
                
                if (sortedIndices.includes(index)) {
                    bar.classList.add('sorted');
                } else if (comparingIndices.includes(index)) {
                    bar.classList.add('comparing');
                } else if (swappingIndices.includes(index)) {
                    bar.classList.add('swapping');
                }
                
                arrayContainer.appendChild(bar);
            });
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function startSorting() {
            if (sorting) return;
            sorting = true;
            stopped = false;
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            resetBtn.disabled = true;
            algorithmSelect.disabled = true;
            arraySizeInput.disabled = true;

            const algorithm = algorithmSelect.value;

            switch (algorithm) {
                case 'bubble':
                    await bubbleSort();
                    break;
                case 'selection':
                    await selectionSort();
                    break;
                case 'insertion':
                    await insertionSort();
                    break;
                case 'merge':
                    await mergeSort(0, array.length - 1);
                    break;
                case 'quick':
                    await quickSort(0, array.length - 1);
                    break;
            }

            if (!stopped) {
                displayArray([], [], array.map((_, i) => i));
            }
            
            sorting = false;
            startBtn.style.display = 'inline-block';
            stopBtn.style.display = 'none';
            resetBtn.disabled = false;
            algorithmSelect.disabled = false;
            arraySizeInput.disabled = false;
        }

        function stopSorting() {
            stopped = true;
            sorting = false;
            startBtn.style.display = 'inline-block';
            stopBtn.style.display = 'none';
            resetBtn.disabled = false;
            algorithmSelect.disabled = false;
            arraySizeInput.disabled = false;
        }

        async function bubbleSort() {
            const n = array.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (stopped) return;
                    displayArray([j, j + 1], []);
                    await sleep(speed);
                    
                    if (array[j] > array[j + 1]) {
                        [array[j], array[j + 1]] = [array[j + 1], array[j]];
                        displayArray([], [j, j + 1]);
                        await sleep(speed);
                    }
                }
            }
        }

        async function selectionSort() {
            const n = array.length;
            for (let i = 0; i < n - 1; i++) {
                let minIdx = i;
                for (let j = i + 1; j < n; j++) {
                    if (stopped) return;
                    displayArray([minIdx, j], []);
                    await sleep(speed);
                    
                    if (array[j] < array[minIdx]) {
                        minIdx = j;
                    }
                }
                
                if (minIdx !== i) {
                    [array[i], array[minIdx]] = [array[minIdx], array[i]];
                    displayArray([], [i, minIdx]);
                    await sleep(speed);
                }
            }
        }

        async function insertionSort() {
            const n = array.length;
            for (let i = 1; i < n; i++) {
                if (stopped) return;
                let key = array[i];
                let j = i - 1;
                
                displayArray([i], []);
                await sleep(speed);
                
                while (j >= 0 && array[j] > key) {
                    if (stopped) return;
                    array[j + 1] = array[j];
                    displayArray([], [j, j + 1]);
                    await sleep(speed);
                    j--;
                }
                array[j + 1] = key;
            }
        }

        async function mergeSort(left, right) {
            if (stopped || left >= right) return;
            
            const mid = Math.floor((left + right) / 2);
            await mergeSort(left, mid);
            await mergeSort(mid + 1, right);
            await merge(left, mid, right);
        }

        async function merge(left, mid, right) {
            const leftArr = array.slice(left, mid + 1);
            const rightArr = array.slice(mid + 1, right + 1);
            
            let i = 0, j = 0, k = left;
            
            while (i < leftArr.length && j < rightArr.length) {
                if (stopped) return;
                displayArray([left + i, mid + 1 + j], []);
                await sleep(speed);
                
                if (leftArr[i] <= rightArr[j]) {
                    array[k] = leftArr[i];
                    i++;
                } else {
                    array[k] = rightArr[j];
                    j++;
                }
                displayArray([], [k]);
                await sleep(speed);
                k++;
            }
            
            while (i < leftArr.length) {
                if (stopped) return;
                array[k] = leftArr[i];
                displayArray([], [k]);
                await sleep(speed);
                i++;
                k++;
            }
            
            while (j < rightArr.length) {
                if (stopped) return;
                array[k] = rightArr[j];
                displayArray([], [k]);
                await sleep(speed);
                j++;
                k++;
            }
        }

        async function quickSort(low, high) {
            if (stopped || low >= high) return;
            const pi = await partition(low, high);
            await quickSort(low, pi - 1);
            await quickSort(pi + 1, high);
        }

        async function partition(low, high) {
            const pivot = array[high];
            let i = low - 1;
            
            for (let j = low; j < high; j++) {
                if (stopped) return i + 1;
                displayArray([j, high], []);
                await sleep(speed);
                
                if (array[j] < pivot) {
                    i++;
                    [array[i], array[j]] = [array[j], array[i]];
                    displayArray([], [i, j]);
                    await sleep(speed);
                }
            }
            
            [array[i + 1], array[high]] = [array[high], array[i + 1]];
            displayArray([], [i + 1, high]);
            await sleep(speed);
            
            return i + 1;
        }
        

        window.addEventListener('resize', () => {
            if (!sorting) {
                displayArray();
            }
        });

        generateArray();