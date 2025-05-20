<?php

namespace App\Console\Commands;

use App\Services\MlRecommendationService;
use Illuminate\Console\Command;
use Rubix\ML\Datasets\Labeled;
use Rubix\ML\Classifiers\KNearestNeighbors;
use Rubix\ML\Persisters\Filesystem;
use App\Models\TouristPlace;
use Rubix\ML\PersistentModel;
use Rubix\ML\Pipeline;
use Rubix\ML\Transformers\NumericStringConverter;
use Rubix\ML\Transformers\OneHotEncoder;
use Illuminate\Support\Facades\Storage;

class TestRecommendationModel extends Command
{
    protected $signature = 'ml:train-recommendations';
    protected $description = 'Train the recommendation model using tourist places data';

     public function handle()
    {
        $modelDir = storage_path('app/models');
        if (!file_exists($modelDir)) {
            Storage::makeDirectory('models');
        }

        $samples = [];
        $labels = [];

        $places = TouristPlace::all();

        foreach ($places as $place) {
            $samples[] = [
                (float)$place->rating_weighted,
                $place->category, 
                $place->country  
            ];
            $labels[] = $place->category; 
        }

        $dataset = new Labeled($samples, $labels);

        $estimator = new PersistentModel(
            new Pipeline([
                new NumericStringConverter(),
                new OneHotEncoder(),
            ], new KNearestNeighbors(3)),
            new Filesystem(storage_path('app/models/recommendation.rubix'))
        );

        $estimator->train($dataset);
        $estimator->save();

        $this->info('Model trained and saved to: ' . storage_path('app/models/recommendation.rubix'));
    }
}
