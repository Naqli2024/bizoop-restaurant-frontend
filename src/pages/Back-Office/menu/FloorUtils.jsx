export const flattenFloors = (floors = []) =>
  floors
    .filter((f) => f.isActive !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((floor) =>
      [...(floor.tables || [])]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((t) => ({
          id: t._id,
          name: t.tableName,
          zone: floor.floorName,
          floorId: floor._id,
          status: t.occupancyStatus,   // "Available", "Partially Occupied", ...
          meta: `${t.occupiedSeats}/${t.seatingCapacity} seats`,
          seatingCapacity: t.seatingCapacity,
          occupiedSeats: t.occupiedSeats,
          availableSeats: t.availableSeats,
          orders: t.currentOrders || [],
        }))
    );