import { IPlacement } from "../core/placement";
import { IEventService } from "./event.service";
export declare abstract class IBaseService {
    protected placement: IPlacement;
    setState(key: string, value: any): void;
    getState(key: string): any;
    getPlacement(): IPlacement;
    getEvents(): IEventService;
}
