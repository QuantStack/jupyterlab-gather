/**
 * Modified from Jitsi Meet, originally authored by Jitsi.
 * https://github.com/jitsi/jitsi-meet
 */

import {
  ASPECT_RATIO_BREAKPOINT,
  TILE_ASPECT_RATIO,
  TILE_HORIZONTAL_MARGIN,
  TILE_MIN_HEIGHT_LARGE,
  TILE_MIN_HEIGHT_SMALL,
  TILE_PORTRAIT_ASPECT_RATIO,
  TILE_VERTICAL_MARGIN,
  TILE_VIEW_DEFAULT_NUMBER_OF_VISIBLE_TILES,
  TILE_VIEW_GRID_HORIZONTAL_MARGIN,
  TILE_VIEW_GRID_VERTICAL_MARGIN
} from '../constants';

interface IDimensions {
  height?: number;
  maxArea: number;
  numberOfVisibleParticipants?: number;
  width?: number;
}

export function calculateThumbnailSizeForTileView({
  columns,
  minVisibleRows,
  clientWidth,
  clientHeight
}: {
  clientHeight: number;
  clientWidth: number;
  columns: number;
  minVisibleRows: number;
}) {
  const aspectRatio = TILE_ASPECT_RATIO;
  const minHeight = getThumbnailMinHeight(clientWidth);
  const viewWidth =
    clientWidth -
    columns * TILE_HORIZONTAL_MARGIN -
    TILE_VIEW_GRID_HORIZONTAL_MARGIN;
  const availableHeight = clientHeight - TILE_VIEW_GRID_VERTICAL_MARGIN;
  const viewHeight = availableHeight - minVisibleRows * TILE_VERTICAL_MARGIN;
  const initialWidth = viewWidth / columns;
  let initialHeight = viewHeight / minVisibleRows;
  let minHeightEnforced = false;

  if (initialHeight < minHeight) {
    minHeightEnforced = true;
    initialHeight = minHeight;
  }

  const initialRatio = initialWidth / initialHeight;
  let height = initialHeight;
  let width;

  // The biggest area of the grid will be when the grid's height is equal to clientHeight or when the grid's width is
  // equal to clientWidth.

  if (initialRatio > aspectRatio) {
    width = initialHeight * aspectRatio;
  } else if (initialRatio >= TILE_PORTRAIT_ASPECT_RATIO) {
    width = initialWidth;
  } else if (!minHeightEnforced) {
    height = initialWidth / TILE_PORTRAIT_ASPECT_RATIO;

    if (height >= minHeight) {
      width = initialWidth;
    } else {
      // The width is so small that we can't reach the minimum height with portrait aspect ratio.
      return;
    }
  } else {
    // We can't fit that number of columns with the desired min height and aspect ratio.
    return;
  }

  return {
    height,
    width,
    minHeightEnforced,
    maxVisibleRows: Math.floor(
      availableHeight / (height + TILE_VERTICAL_MARGIN)
    )
  };
}

export function calculateResponsiveTileViewDimensions({
  clientWidth,
  clientHeight,
  maxColumns,
  numberOfParticipants,
  desiredNumberOfVisibleTiles = TILE_VIEW_DEFAULT_NUMBER_OF_VISIBLE_TILES
}: {
  clientHeight: number;
  clientWidth: number;
  desiredNumberOfVisibleTiles: number;
  maxColumns: number;
  numberOfParticipants: number;
}) {
  let height, width;

  let dimensions: IDimensions = {
    maxArea: 0
  };
  let minHeightEnforcedDimensions: IDimensions = {
    maxArea: 0
  };

  for (
    let col = 1;
    col <=
    Math.min(maxColumns, numberOfParticipants, desiredNumberOfVisibleTiles);
    col++
  ) {
    const rows = Math.ceil(numberOfParticipants / col);

    // we want to display as much as possible thumbnails up to desiredNumberOfVisibleTiles
    const visibleRows =
      numberOfParticipants <= desiredNumberOfVisibleTiles
        ? rows
        : Math.floor(desiredNumberOfVisibleTiles / col);

    const size = calculateThumbnailSizeForTileView({
      columns: col,
      minVisibleRows: visibleRows,
      clientWidth,
      clientHeight
    });

    if (size) {
      const {
        height: currentHeight,
        width: currentWidth,
        minHeightEnforced,
        maxVisibleRows
      } = size;

      const numberOfVisibleParticipants = Math.min(
        col * maxVisibleRows,
        numberOfParticipants
      );

      const area = Math.round(
        (currentHeight + TILE_VERTICAL_MARGIN) *
          (currentWidth + TILE_HORIZONTAL_MARGIN) *
          numberOfVisibleParticipants
      );

      const currentDimensions = {
        maxArea: area,
        height: currentHeight,
        width: currentWidth,
        columns: col,
        rows: rows,
        numberOfVisibleParticipants
      };
      const {
        numberOfVisibleParticipants: oldNumberOfVisibleParticipants = 0
      } = dimensions;

      if (!minHeightEnforced) {
        if (area > dimensions.maxArea) {
          dimensions = currentDimensions;
        } else if (
          area === dimensions.maxArea &&
          ((oldNumberOfVisibleParticipants > desiredNumberOfVisibleTiles &&
            oldNumberOfVisibleParticipants >= numberOfParticipants) ||
            (oldNumberOfVisibleParticipants < numberOfParticipants &&
              numberOfVisibleParticipants <= desiredNumberOfVisibleTiles))
        ) {
          // If the area of the new candidates and the old ones are equal we prefer the one that will have
          // closer number of visible participants to desiredNumberOfVisibleTiles config.
          dimensions = currentDimensions;
        }
      } else if (
        minHeightEnforced &&
        area >= minHeightEnforcedDimensions.maxArea
      ) {
        // If we choose configuration with minHeightEnforced there will be less than desiredNumberOfVisibleTiles
        // visible tiles, that's why we prefer more columns when the area is the same.
        minHeightEnforcedDimensions = currentDimensions;
      }
    }
  }

  if (dimensions.maxArea > 0) {
    ({ height, width } = dimensions);
  } else if (minHeightEnforcedDimensions.maxArea > 0) {
    ({ height, width } = minHeightEnforcedDimensions);
  } else {
    // This would mean that we can't fit even one thumbnail with minimal size.
    const aspectRatio = TILE_PORTRAIT_ASPECT_RATIO;

    height = getThumbnailMinHeight(clientWidth);
    width = aspectRatio * height;
  }

  return {
    height,
    width
  };
}

export function getMaxColumnCount(clientWidth: number) {
  const widthToUse = clientWidth;

  const aspectRatio = TILE_PORTRAIT_ASPECT_RATIO;
  const minHeight = getThumbnailMinHeight(widthToUse);
  const minWidth = aspectRatio * minHeight;

  return Math.floor(widthToUse / minWidth);
}

export function getThumbnailMinHeight(clientWidth: number) {
  return clientWidth < ASPECT_RATIO_BREAKPOINT
    ? TILE_MIN_HEIGHT_SMALL
    : TILE_MIN_HEIGHT_LARGE;
}
