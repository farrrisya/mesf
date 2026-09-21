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
            static::logAction($model, 'Tambah', "Menambah data " . static::getModelName($model));
        });

        static::updated(function ($model) {
            static::logAction($model, 'Kemaskini', "Mengemaskini data " . static::getModelName($model));
        });

        static::deleted(function ($model) {
            static::logAction($model, 'Hapus', "Menghapus data " . static::getModelName($model));
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
            'description' => $description,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'properties' => array_merge(
                ['item_name' => $itemName],
                $action === 'Kemaskini' ? [
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
            'Notice' => 'Notis & Berita',
            'Penerbitan' => 'Penerbitan',
            'Document' => 'Muat Turun (Dokumen)',
            'Gallery' => 'Galeri',
            'Album' => 'Album',
            'Slider' => 'Slider',
            'Setting' => 'Tetapan Sistem',
            'User' => 'Pengguna (Staff & Admin)',
            'Media' => 'Media',
        ];

        return $names[$className] ?? $className;
    }
}
