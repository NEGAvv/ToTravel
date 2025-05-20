<?php

namespace App\Console\Commands;

use App\Models\TouristPlace;
use Illuminate\Console\Command;

class RecalculateRatings extends Command
{
    protected $signature = 'ratings:recalculate';
    protected $description = 'Recalculate all place ratings using weighted average';

    public function handle()
    {
        $places = TouristPlace::with('reviews')->get();
        $bar = $this->output->createProgressBar(count($places));

        foreach ($places as $place) {
            $place->updateRating();
            $bar->advance();
        }

        $bar->finish();
        $this->info("\nAll ratings recalculated successfully.");
        
        return Command::SUCCESS;
    }
}
