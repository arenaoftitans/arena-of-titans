
package com.aot.engine.api.json;

import com.aot.engine.board.Board;

public interface JsonExportable {
    public void prepareForJsonExport();
    public void resetAfterJsonImport(Board board);
}
