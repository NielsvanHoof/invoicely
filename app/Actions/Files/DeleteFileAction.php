<?php

namespace App\Actions\Files;

use Illuminate\Support\Facades\Storage;

class DeleteFileAction
{
    /**
     * The disk to use for file storage.
     */
    protected string $disk = 's3';

    /**
     * Delete a file.
     *
     * @param  string|null  $filePath  The file path
     * @return bool True if the file was deleted, false otherwise
     */
    public function execute(?string $filePath): bool
    {
        if (! $filePath) {
            return false;
        }

        return Storage::disk($this->disk)->delete($filePath);
    }
}
