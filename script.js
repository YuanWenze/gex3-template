const app = Vue.createApp({
    data() {
        return {
            form: {
                fullName: '',
                dob: '',
                gender: '',
                totalVisitors: 1,
                childrenCount: 0,
                accommodation: '',
                cardholderName: '',
                cardNumber: '',
                expiryDate: '',
                cvv: ''
            },
            errors: {
                fullName: '',
                dob: '',
                gender: '',
                selectedPlaces: '',
                totalVisitors: '',
                childrenCount: '',
                accommodation: '',
                cardholderName: '',
                cardNumber: '',
                expiryDate: '',
                cvv: ''
            },
            generalError: '',
            places: [],
            isLoadingPlaces: false,
            placesError: '',
            selectedPlaces: [],
            accommodationOptions: [
                'No accommodation needed',
                'Forest View Hotel',
                'Totoro Family Inn',
                'Witch Valley Guesthouse',
                'Luxury Ghibli Resort'
            ],
            showSummary: false
        }
    },
    computed: {
        selectedPlacesDetails() {
            var self = this;
            return this.places.filter(function(place) {
                return self.selectedPlaces.includes(place.id);
            });
        }
    },
    mounted() {
        this.loadPlaces();
    },
    methods: {
        loadPlaces() {
            var self = this;
            this.isLoadingPlaces = true;
            this.placesError = '';
            
            fetch('ghibli_park.json')
                .then(function(response) {
                    if (!response.ok) {
                        self.placesError = 'Could not load the list of places';
                        self.isLoadingPlaces = false;
                        return;
                    }
                    return response.json();
                })
                .then(function(data) {
                    if (data) {
                        self.places = data;
                        self.isLoadingPlaces = false;
                    }
                })
                .catch(function() {
                    self.isLoadingPlaces = false;
                    self.placesError = 'Could not load the list of places';
                });
        },
        isPlaceSelected(placeId) {
            return this.selectedPlaces.includes(placeId);
        },
        togglePlace(place) {
            var index = this.selectedPlaces.indexOf(place.id);
            if (index === -1) {
                this.selectedPlaces.push(place.id);
            } else {
                this.selectedPlaces.splice(index, 1);
            }
            if (this.selectedPlaces.length > 0) {
                this.errors.selectedPlaces = '';
            }
        },
        truncateDescription(desc) {
         return desc;
        },
        formatDate(dateString) {
            if (!dateString) return '';
            
            var parts = dateString.split('-');
            var year = parts[0];
            var month = parts[1];
            var day = parts[2];
            
            if (month && month.length === 1) {
                month = '0' + month;
            }
            if (day && day.length === 1) {
                day = '0' + day;
            }
            
            return year + '-' + month + '-' + day;
        },
        formatExpiryDate(dateString) {
            if (!dateString) return '';
            return dateString;
        },
        maskCardNumber(cardNumber) {
            if (!cardNumber) return '';
            
            var cleaned = '';
            for (var i = 0; i < cardNumber.length; i++) {
                if (cardNumber[i] !== ' ') {
                    cleaned = cleaned + cardNumber[i];
                }
            }
            
            if (cleaned.length <= 4) {
                return cleaned;
            }
            
            var lastFour = cleaned.substring(cleaned.length - 4);
            var remainingLength = cleaned.length - 4;
            var groups = Math.floor(remainingLength / 4);
            var remainder = remainingLength % 4;
            var masked = '';
            
            for (var j = 0; j < groups; j++) {
                masked = masked + '**** ';
            }
            
            if (remainder > 0) {
                for (var k = 0; k < remainder; k++) {
                    masked = masked + '*';
                }
                masked = masked + ' ';
            }
            
            return masked + lastFour;
        },
        clearErrors() {
            this.errors = {
                fullName: '',
                dob: '',
                gender: '',
                selectedPlaces: '',
                totalVisitors: '',
                childrenCount: '',
                accommodation: '',
                cardholderName: '',
                cardNumber: '',
                expiryDate: '',
                cvv: ''
            };
            this.generalError = '';
        },
        validateForm() {
            var isValid = true;

            if (this.form.fullName.trim() === '') {
                this.errors.fullName = 'Full name is required.';
                isValid = false;
            }
            if (!this.form.dob) {
                this.errors.dob = 'Date of birth is required.';
                isValid = false;
            }
            if (!this.form.gender) {
                this.errors.gender = 'Please select your gender.';
                isValid = false;
            }
            if (this.selectedPlaces.length === 0) {
                this.errors.selectedPlaces = 'Please select at least one Ghibli Park place.';
                isValid = false;
            }
            if (!this.form.totalVisitors || this.form.totalVisitors < 1) {
                this.errors.totalVisitors = 'Total number of visitors is required (minimum 1).';
                isValid = false;
            }
            if (this.form.childrenCount === undefined || this.form.childrenCount === null || this.form.childrenCount < 0) {
                this.errors.childrenCount = 'Number of children is required (minimum 0).';
                isValid = false;
            }
            if (!this.form.accommodation) {
                this.errors.accommodation = 'Please select an accommodation option.';
                isValid = false;
            }
            if (!this.form.cardholderName.trim()) {
                this.errors.cardholderName = 'Name on card is required.';
                isValid = false;
            }
            if (!this.form.cardNumber.trim()) {
                this.errors.cardNumber = 'Card number is required.';
                isValid = false;
            }
            if (!this.form.expiryDate) {
                this.errors.expiryDate = 'Expiration date is required.';
                isValid = false;
            }
            if (!this.form.cvv.trim()) {
                this.errors.cvv = 'CVC is required.';
                isValid = false;
            }

            return isValid;
        },
        generateItinerary() {
            this.clearErrors();
            this.showSummary = false;

            if (this.validateForm()) {
                this.showSummary = true;
                this.generalError = '';
            } else {
                this.generalError = 'There are mandatory items pending to be filled. Please complete the required fields.';
                this.showSummary = false;
            }
        }
    }
});

app.mount('#app');
