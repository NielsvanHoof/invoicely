<?php

namespace App\Actions\Files;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StoreFileAction
{
    /**
     * The disk to use for file storage.
     */
    protected string $disk = 's3';

    /**
     * Store a file.
     *
     * @param  UploadedFile  $file  The file to store
     * @param  int  $userId  The user ID
     * @param  string  $directory  The directory to store the file in (e.g., 'invoices', 'documents')
     * @return string|null The file path
     */
    public function execute(UploadedFile $file, int $userId, string $directory): ?string
    {
        $fileName = time().'_'.$file->getClientOriginalName();

        return Storage::disk($this->disk)->putFileAs(
            $directory.'/'.$userId,
            $file,
            $fileName
        );
    }
}
