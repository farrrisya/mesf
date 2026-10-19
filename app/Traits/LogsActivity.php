<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    /**
     * Boot the trait for a model.
     */
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            static::logAction($model, 'Create', "Created " . static::getModelName($model));
        });

        static::updated(function ($model) {
            static::logAction($model, 'Update', "Updated " . static::getModelName($model));
        });

        static::deleted(function ($model) {
            static::logAction($model, 'Delete', "Deleted " . static::getModelName($model));
        });
    }

    /**
     * Log an action to the database.
     */
    protected static function logAction($model, $action, $description)
    {
        $itemName = $model->title ?? $model->name ?? $model->question ?? $model->key ?? '';

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'description' => $description . ($itemName ? " [{$itemName}]" : ''),
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'properties' => array_merge(
                ['item_name' => $itemName],
                $action === 'Update' || $action === 'Kemaskini' ? [
                    'old' => $model->getOriginal(),
                    'new' => $model->getChanges(),
                ] : []
            ),
        ]);
    }

    /**
     * Get a readable name for the model.
     */
    protected static function getModelName($model)
    {
        $className = class_basename(get_class($model));

        $names = [
            'News' => 'News Article',
            'Slider' => 'Banner Slider',
            'Setting' => 'System Setting',
            'User' => 'Staff User',
            'Media' => 'Media Asset',
            'League' => 'League',
            'Team' => 'Team',
            'EsportMatch' => 'Match Fixture',
        ];

        return $names[$className] ?? $className;
    }
}
