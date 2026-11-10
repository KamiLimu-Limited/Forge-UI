// Every rate the Forge API returns (core_rate, combined_rate, average_*_rate, rate,
// graduation_rate) is already a percentage from 0 to 100: forge-api computes them all
// with percent() in services/points.py. Never multiply one by 100.
export type Percentage = number
