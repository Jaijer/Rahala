// src/services/dataService.js
const fs = require('fs').promises;
const path = require('path');

class DataService {
    constructor() {
        this.data = {};
        this.dataDir = path.join(process.cwd(), 'data');
        this.cities = new Set();
        this.citiesLowerMap = new Map(); // Map to store lowercase to proper case
    }

    async readJsonFile(filePath) {
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            throw error;
        }
    }

    async loadData() {
        try {
            console.log('Loading data from:', this.dataDir);
            const files = await fs.readdir(this.dataDir);
            console.log('Found files:', files);

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(this.dataDir, file);
                    const category = path.basename(file, '.json');
                    const jsonData = await this.readJsonFile(filePath);
                    this.data[category] = jsonData;

                    // Collect unique cities and build case mapping
                    if (category === 'travels') {
                        jsonData.travels.forEach(travel => {
                            this.cities.add(travel.departureCity);
                            this.cities.add(travel.destinationCity);
                            // Store lowercase to proper case mapping
                            this.citiesLowerMap.set(travel.departureCity.toLowerCase(), travel.departureCity);
                            this.citiesLowerMap.set(travel.destinationCity.toLowerCase(), travel.destinationCity);
                        });
                    }

                    console.log(`Successfully loaded ${category} data`);
                }
            }

            console.log('Available cities:', Array.from(this.cities));
            console.log('Loaded data categories:', Object.keys(this.data));
            return true;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    // Helper method to get proper case city name
    getProperCaseCity(city) {
        if (!city) return null;
        return this.citiesLowerMap.get(city.toLowerCase());
    }

    // Helper method to check if city exists (case-insensitive)
    cityExists(city) {
        if (!city) return false;
        return this.citiesLowerMap.has(city.toLowerCase());
    }

    async searchData({ departureCity, destinationCity, preference }) {
        console.log('\nSearching with criteria:', { departureCity, destinationCity, preference });
        
        try {
            let results = this.data.travels?.travels || [];
            const availableCities = Array.from(this.cities);
            console.log('Available cities:', availableCities);
            console.log('Initial results count:', results.length);

            // First check if departure city exists in our data
            if (departureCity) {
                if (!this.cityExists(departureCity)) {
                    return {
                        matches: [],
                        metadata: {
                            totalResults: 0,
                            searchCriteria: { departureCity, destinationCity, preference },
                            error: 'DEPARTURE_CITY_NOT_FOUND',
                            message: `No flights available from ${departureCity}. Available departure cities are: ${availableCities.join(', ')}`,
                            availableCities: availableCities
                        }
                    };
                }
                
                const properDepartureCity = this.getProperCaseCity(departureCity);
                // Filter by departure city
                results = results.filter(t => t.departureCity === properDepartureCity);
                console.log(`After departure city filter (${properDepartureCity}): ${results.length} results`);
            }

            // Check destination city if provided
            if (destinationCity) {
                if (!this.cityExists(destinationCity)) {
                    return {
                        matches: [],
                        metadata: {
                            totalResults: 0,
                            searchCriteria: { departureCity, destinationCity, preference },
                            error: 'DESTINATION_CITY_NOT_FOUND',
                            message: `Destination ${destinationCity} not available. Available cities are: ${availableCities.join(', ')}`,
                            availableCities: availableCities
                        }
                    };
                }

                const properDestinationCity = this.getProperCaseCity(destinationCity);
                // Filter by destination city
                results = results.filter(t => t.destinationCity === properDestinationCity);
                console.log(`After destination city filter (${properDestinationCity}): ${results.length} results`);
            }

            // Handle case where no flights are found after filtering
            if (results.length === 0) {
                const properDepartureCity = this.getProperCaseCity(departureCity);
                const properDestinationCity = this.getProperCaseCity(destinationCity);
                return {
                    matches: [],
                    metadata: {
                        totalResults: 0,
                        searchCriteria: { 
                            departureCity: properDepartureCity, 
                            destinationCity: properDestinationCity, 
                            preference 
                        },
                        error: 'NO_FLIGHTS_FOUND',
                        message: this.generateNoFlightsMessage(properDepartureCity, properDestinationCity),
                        availableCities: availableCities
                    }
                };
            }

            // Apply preference-based sorting if specified
            if (preference) {
                switch(preference.toLowerCase()) {
                    case 'cheap':
                        results.sort((a, b) => a.price - b.price);
                        break;
                    case 'luxury':
                        results = results.filter(t => t.category === 'luxury');
                        results.sort((a, b) => b.price - a.price);
                        break;
                    case 'best value':
                        results.sort((a, b) => (a.price/parseFloat(a.rating || '1')) - (b.price/parseFloat(b.rating || '1')));
                        break;
                }
                console.log(`After preference filter (${preference}): ${results.length} results`);
            }

            // Return results
            const properDepartureCity = this.getProperCaseCity(departureCity);
            const properDestinationCity = this.getProperCaseCity(destinationCity);
            return {
                matches: results.slice(0, 5), // Limit to top 5 results
                metadata: {
                    totalResults: results.length,
                    searchCriteria: {
                        departureCity: properDepartureCity,
                        destinationCity: properDestinationCity,
                        preference
                    },
                    availableCities: availableCities
                }
            };

        } catch (error) {
            console.error('Error in searchData:', error);
            throw error;
        }
    }

    generateNoFlightsMessage(departureCity, destinationCity) {
        if (departureCity && destinationCity) {
            return `No direct flights found from ${departureCity} to ${destinationCity}.`;
        } else if (departureCity) {
            return `No flights currently available from ${departureCity}.`;
        } else {
            return 'No flights found matching your criteria.';
        }
    }
}

module.exports = new DataService();