import React, { Component, useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import './App.css';
import Form from './components/form';
const apiUrl = "http://staging.watsoo.com:8080/watsoo-amazon-api//trip-controller-web/v1/vehicle/wise/summary/36";
const bodyData = {
  "clientId": 10,
  "dataRecord": {
    "userRoleId": "4",
    "userRoleName": "COMPANY",
    "userId": 10
  },
  "fromDate": 1577888571659,
  "toDate": 1593613371659,
  "tripId": 36
};
function App(props) {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    try {
      const { data } = await axios.post(apiUrl, bodyData);
      data.data.tripDetails.forEach(element => {
        element.isOpen = true
      });
      setData(data.data.tripDetails);
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false);
    }
  }, [])
  const toggle = index => {
    const newData = [...Data];
    Data[index].isOpen = !Data[index].isOpen;
    setData(newData)
  }
  const calculateExpenses = expenses => {
    if (expenses.length) {
      return expenses.reduce((prev, next) => {
        prev = prev + next.amount;
        return prev
      }, 0)
    }
    else {
      return 0
    }

  }
  const calculateTripTime = time => {
    var totalMinutes = moment.duration(moment(time)).asMinutes();
    var hours, minutes = 0;
    if (totalMinutes) {
      hours = parseInt(totalMinutes / 60);
      if (totalMinutes > 60) {
        minutes = parseInt(totalMinutes % 60);
      }
    }
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`
  }
  const getTotalKm = trips => {
    return trips.tripLists.reduce((prev, next) => {
      prev = prev + parseInt(next.totalKm);
      return prev
    }, 0)
  }
  const getTotalExpenses = trips => {
    return trips.tripLists.reduce((prev, next) => {
      prev = prev + next.tripExpenses.reduce((prev1, next1) => {
        prev1 = prev1 + next1.amount
        return prev1
      }, 0);
      return prev
    }, 0)
  }

  return <div>
    {!loading && <div>
      {Data.map((T, INDEX) => <div className="data-block">
        <div className="header">
          <div>Date: {moment(parseInt(T.startDay)).calendar()} ({moment(parseInt(T.startDay)).format('LT')}) -
          {moment(parseInt(T.endDay)).calendar()} ({moment(parseInt(T.endDay)).format('LT')})
          ({calculateTripTime(parseInt(T.endDay) - parseInt(T.startDay))})

          </div>
          <div><span className="total-km">Total Km: {getTotalKm(T)} </span><span className="total-expenses">Total Expenses: {getTotalExpenses(T)}</span></div>
          <div onClick={() => toggle(INDEX)}><i className={T.isOpen ? "fa fa-minus" : "fa fa-plus"} /></div>
        </div>
        {T.isOpen && <div className="table-area">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Trip Start(Node) to Trip Ends(Node)</th>
                <th>Driver Name</th>
                <th>Trip Expenses</th>
                <th>Tip Km</th>
                <th>Trip GPS Km</th>
                <th> Trip Time</th>
                <th>Odometer Reading</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {T.tripLists.map((t, index) => <tr>
                <td>{index + 1}</td>
                <td>{t.startPointNode}({moment(parseInt(t.startTripDate)).format('LT')}) <i className="fa fa-long-arrow-right"></i> {t.endPointNode}({moment(parseInt(t.endTripDate)).format('LT')})</td>
                <td>{t.driverName}</td>
                <td>Rs: {calculateExpenses(t.tripExpenses)} <i className="info fa fa-info-circle" /></td>
                <td>{t.totalKm} Km</td>
                <td>{t.gpsDistance} km</td>
                <td>{calculateTripTime(t.tripRunningTime)}</td>
                <td>{t.startODOMeter ? t.startODOMeter : "N/A"} <i className="fa fa-long-arrow-right" /> {t.endODOMeter ? t.endODOMeter : "N/A"}</td>
                <td><button>Movement Report</button><button>Stoppage Report</button></td>
              </tr>)}
            </tbody>
          </table>
        </div>}
      </div>)}
    </div>}
  </div>
}
export default App;
