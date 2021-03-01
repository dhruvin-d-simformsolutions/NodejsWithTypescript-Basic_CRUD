// # get all items
// GET /api/menu/items

// # get a single item using an id parameter
// GET /api/menu/items/:id

// # create an item
// POST /api/menu/items

// # update an item using an id parameter
// PUT /api/menu/items/:id

// # remove an item using an id parameter
// DELETE /api/menu/items/:id

import express, { Request, Response } from "express";
import * as ItemService from "./items.service";
import { BaseItem, Item } from "./item.interface";
import { resolveSoa } from "dns";
import { Items } from "./items.interface";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const items: Item[] = await ItemService.findAll();

    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

itemsRouter.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const item: Item = await ItemService.find(id);

    if (item) {
      res.status(200).send(item);
    }
    res.status(404).send("Item not Found");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

itemsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const item: BaseItem = req.body;

    const newItem = await ItemService.create(item);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

itemsRouter.put("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
  
    try {
      const itemUpdate: Item = req.body;
  
      const existingItem: Item = await ItemService.find(id);
  
      if (existingItem) {
        const updatedItem = await ItemService.update(id, itemUpdate);
        return res.status(200).json(updatedItem);
      }
  
      const newItem = await ItemService.create(itemUpdate);
  
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

itemsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await ItemService.remove(id);

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
