import { v4 } from 'uuid';

export class ProcessInputModel {
    private name: string;
    private commingTime: number;
    private burstTime: number;

    public constructor(
        name: string,
        commingTime: number,
        burstTime: number
        ) {
        this.name = name;
        this.commingTime = commingTime;
        this.burstTime = burstTime;
    }

    public get Name(): string {return this.name}
    public set Name(name: string) {this.name = name;}

    public get CommingTime(): number {return this.commingTime}
    public set CommingTime(commingTime: number) {this.commingTime = commingTime;}

    public get BurstTime(): number {return this.burstTime}
    public set BurstTime(burstTime: number) {this.burstTime = burstTime;}
}

export class ProcessModel extends ProcessInputModel {
    private id: string;
    private startTime: number;
    private endTime: number;
    private waitingTime: number;
    private turnAroundTime: number;
    private lockedTime:number;
    private statusProcess:any;

    public constructor({Name, CommingTime, BurstTime}: ProcessInputModel) {
        super(Name, CommingTime, BurstTime);
        this.id = v4();
        this.startTime = -1;
        this.endTime = -1;
        this.waitingTime = -1;
        this.turnAroundTime = -1;
        this.lockedTime = -1;
        this.statusProcess = {};
    }

    public get Id(): string {return this.id;}

    public get StartTime(): number {return this.startTime}
    public set StartTime(startTime: number) {this.startTime = startTime;}

    public get EndTime(): number {return this.endTime}
    public set EndTime(endTime: number) {this.endTime = endTime;}

    public get WaitingTime(): number {return this.waitingTime}
    public set WaitingTime(waitingTime: number) {this.waitingTime = waitingTime;}

    public get TurnAroundTime(): number {return this.turnAroundTime}
    public set TurnAroundTime(turnAroundTime: number) {this.turnAroundTime = turnAroundTime;}

    public get LockedTime(): number {return this.lockedTime}
    public set LockedTime(lockedTime: number) {this.lockedTime = lockedTime;}

    public get StatusProcess(): any {return this.statusProcess}
    public set StatusProcess(statusProcess: any) {this.statusProcess = statusProcess;}

    public copy(): ProcessModel {
        return new ProcessModel(
            new ProcessInputModel(
                `${this.Name}*`,
                this.CommingTime,
                this.BurstTime
            )
        );
    }
    
}