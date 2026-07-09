export interface IVehicle {
  doors: number;
  color: string;
  automatic: boolean;
  fuelConsumption: number;
  calcFuelNeeded(distance: number): number;
}

export class Car implements IVehicle {
  doors: number;
  color: string;
  automatic: boolean;
  fuelConsumption: number;

  constructor(doors: number, color: string, automatic: boolean, fuelConsumption: number) {
    this.doors = doors;
    this.color = color;
    this.automatic = automatic;
    this.fuelConsumption = fuelConsumption;
  }

  calcFuelNeeded(distance: number): number {
    return (distance * this.fuelConsumption) / 100;
  }
}
