import { ProcessModel } from 'models/ProcessModel';
import { useEffect, useState } from 'react';
import { getLastExecutedProcess } from 'util/processUtil';
import { setAlgorithmStatus } from 'util/store/algorithmStatus';
import { updateProcess } from 'util/store/computedProcess';
import { setCurrentProcess } from 'util/store/currentProcess';
import { useAppSelector, useAppDispatch } from './redux';

export const usePlanificationSolver = (): void => {

    const processList = useAppSelector(({ computedProcess: { value } }) => value);
    const { currentProcess, isBlocked } = useAppSelector(({ currentProcess: { value } }) => value);
    const algorithmStatus = useAppSelector(({ algorithmStatus: { value } }) => value);
    const timer = useAppSelector(({ timer: { value } }) => value);

    const dispatch = useAppDispatch();

    const [waitTimeLocked, setWaitTime] = useState(0);
    const [startProcessTime,setStartProcessTime] = useState(0); 

    const TIMEOUT = timer * 1000;

    const calculateTotalTimeExecution = (currentProcess:ProcessModel,indexProcessTime:number):number => {
        if(!currentProcess.StatusProcess[indexProcessTime]){
            return 0;
        }
        return currentProcess.StatusProcess[indexProcessTime].relativeStartTime + 1;
    }

    const countTimeExecution = (currentProcess:ProcessModel,discriminant:boolean):number => {
        let tempExcutionTime = 0;
        for(let key in currentProcess.StatusProcess) {
            if(currentProcess.StatusProcess.hasOwnProperty(key) && currentProcess.StatusProcess[key].wasLocked === discriminant){
                tempExcutionTime += currentProcess.StatusProcess[key].relativeStartTime;
            }
        }
        return tempExcutionTime;
    }

    useEffect(() => {

        if (algorithmStatus) {
            if (currentProcess) {
                if (!isBlocked) {
                    if (currentProcess.EndTime === -1) {
                        const lastProcess = getLastExecutedProcess(processList);
                        if (lastProcess) {
                            currentProcess.StartTime = Math.max(currentProcess.CommingTime, lastProcess.EndTime);
                        } else {
                            currentProcess.StartTime = currentProcess.CommingTime;
                        }

                        currentProcess.StartTime += waitTimeLocked;

                        currentProcess.StatusProcess= {
                            ...currentProcess.StatusProcess,
                            [startProcessTime]:{
                                'relativeStartTime':calculateTotalTimeExecution(currentProcess,startProcessTime),
                                'wasLocked':waitTimeLocked !== 0
                            }
                        };

                        if(countTimeExecution(currentProcess,false) === currentProcess.BurstTime){
                            currentProcess.EndTime = currentProcess.StartTime + currentProcess.BurstTime;
                            currentProcess.TurnAroundTime = currentProcess.EndTime - currentProcess.CommingTime;
                            currentProcess.WaitingTime = (currentProcess.TurnAroundTime - currentProcess.BurstTime) + countTimeExecution(currentProcess,true);
                            currentProcess.LockedTime = (waitTimeLocked === 0) ? (-1) : (waitTimeLocked);
                        }

                        dispatch(
                            setAlgorithmStatus(
                                false
                            )
                        );
                        dispatch(
                            updateProcess(
                                currentProcess
                            )
                        );
                        setWaitTime(0);
                        setTimeout(() => {
                            dispatch(
                                setAlgorithmStatus(
                                    true
                                )
                            );
                        }, TIMEOUT);
                    } else {
                        if(currentProcess.EndTime !== -1){
                            setTimeout(() => {
                                const nextProcessIndex = processList.indexOf(currentProcess) + 1;
                        
                                dispatch(
                                    setCurrentProcess(
                                        processList.at(nextProcessIndex)
                                    )
                                );
                                dispatch(
                                    setAlgorithmStatus(true)
                                );
                            }, TIMEOUT);
                        }
                    }
                } else {
                    const tempRelativeTime = (currentProcess.StatusProcess[startProcessTime].relativeStartTime);

                    currentProcess.StatusProcess = {
                        ...currentProcess.StatusProcess,
                        [tempRelativeTime]:{
                            'relativeStartTime':calculateTotalTimeExecution(currentProcess,tempRelativeTime),
                            'wasLocked':true
                        }
                    };

                    setTimeout(() => {
                        setWaitTime(waitTimeLocked + 1);
                    }, TIMEOUT);

                    setStartProcessTime(tempRelativeTime);
                }
            } else {
                dispatch(
                    setAlgorithmStatus(false)
                );
            }
        }
    }, [algorithmStatus, currentProcess, isBlocked, processList, waitTimeLocked, dispatch, TIMEOUT]);
}