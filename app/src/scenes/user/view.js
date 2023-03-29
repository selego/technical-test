import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";

import { getDaysInMonth } from "./utils";

import Loader from "../../components/loader";
import LoadingButton from "../../components/loadingButton";
import api from "../../services/api";

import SelectMonth from "./../../components/selectMonth";

export default () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      const response = await api.get(`/user/${id}`);
      setUser(response.data);
    })();
  }, []);

  if (!user) return <Loader />;

  return (
    <div>
      <div className="appContainer pt-24">
        <Detail user={user} />
      </div>
    </div>
  );
};

const Activities = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [date, setDate] = useState();
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (!user || !date) return;
    (async () => {
      let from = new Date(date);
      from.setDate(1);
      setDays(getDaysInMonth(from.getMonth(), from.getFullYear()));
      let date_to = new Date(date);
      date_to.setMonth(date_to.getMonth() + 1);
      date_to.setDate(0);
      const { data } = await api.get(`/activity?dateFrom=${from.getTime()}&dateTo=${date_to.getTime()}&userId=${encodeURIComponent(user._id)}`);
      const projects = await api.get(`/project/list`);
      setActivities(
        data.map((activity) => {
          return { ...activity, projectName: (activity.projectName = projects.data.find((project) => project._id === activity.projectId)?.name) };
        }),
      );
    })();
  }, [date, user]);
  
  const getTotal = () => {
    return (activities.reduce((acc, a) => acc + a.total, 0) / 8).toFixed(2);
  };

  return (
    <div>
      <div className="flex flex-wrap p-3 gap-4 text-black	">
        <div className="w-full bg-[#ffffff] border border-[#E5EAEF] rounded-[16px] overflow-hidden">
          <div className="flex gap-5 p-2">
            <SelectMonth start={0} indexDefaultValue={0} value={date} onChange={(e) => setDate(e.target.value)} showArrows />
          </div>
          <div className="mt-2 rounded-[10px] bg-[#fff]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-[10px] text-[14px] font-bold text-[#212325] text-left pl-[10px]">Projects</th>
                    {days.map((e) => {
                      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                      const _date = new Date(e);
                      const day = _date.getDay();
                      const weekday = days[day];
                      const date = _date.getDate();
                      return (
                        <th
                          className={`w-[20px] border border-[#E5EAEF] text-[12px] font-semibold text-center ${day == 0 || day == 6 ? "bg-[#FFD5F1]" : "bg-[white]"}`}
                          key={e}
                          day={day}>
                          <div>{weekday}</div>
                          <div>{date}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-b border-r border-[#E5EAEF]">
                    <th className="px-2">
                      <div className="flex justify-end w-full text-[12px] font-bold text-[#212325] italic">
                        <div>{`Total ${getTotal()} days`}</div>
                      </div>
                    </th>
                    {days.map((e, i) => {
                      const v = activities.reduce((acc, a) => {
                        if (!a.detail[i]) return acc;
                        return acc + a.detail[i].value;
                      }, 0);
                      return <Field key={i} value={v} disabled />;
                    })}
                  </tr>
                  {activities
                    .sort((a, b) => b.total - a.total)
                    .map((e) => {
                      return (
                        <React.Fragment key={`${e.projectName}`}>
                          <tr className="border-t border-b border-r border-[#E5EAEF]" key={`1-${e.projectName}`}>
                            <th className="w-[100px] border-t border-b border-r text-[12px] font-bold text-[#212325] text-left">
                              <div className="flex flex-1 items-center justify-between gap-1 px-2">
                                <div className="flex flex-1 items-center justify-start gap-1">
                                  <img
                                    className="relative z-30 inline object-cover w-[25px] h-[25px] border border-white rounded-full"
                                    src={e?.userAvatar}
                                    alt={`avatar ${e?.user}`}
                                  />
                                  <div>{e.projectName}</div>
                                </div>
                                <div className="text-md italic font-normal">{(e.total / 8).toFixed(2)} days</div>
                              </div>
                            </th>
                            {e.detail.map((f, j) => {
                              return <Field key={`${e.projectName} ${j}`} value={f.value || 0} />;
                            })}
                          </tr>
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ value = "-", ...rest }) => {
  let bgColor = "bg-[white]";
  let textColor = "text-[#000]";
  if (value >= 7) {
    bgColor = "bg-[#216E39]";
    textColor = "text-[#fff]";
  } else if (value >= 5) {
    bgColor = "bg-[#30A14E]";
  } else if (value >= 3) {
    bgColor = "bg-[#40C463]";
  } else if (value > 0) {
    bgColor = "bg-[#9BE9A8]";
  } else {
    textColor = "text-[#aaa]";
  }

  return (
    <th className={`border border-[#E5EAEF] py-[6px] ${bgColor} ${textColor}`}>
      <div className={`text-center font-normal `} {...rest}>
        {value}
      </div>
    </th>
  );
};

const Detail = ({ user }) => {
  const history = useHistory();

  async function deleteData() {
    const confirm = window.confirm("Are you sure ?");
    if (!confirm) return;
    await api.remove(`/user/${user._id}`);
    toast.success("successfully removed!");
    history.push(`/user`);
  }

  return (
    <>
    <Activities user={user} />
    <Formik
      initialValues={user}
      onSubmit={async (values) => {
        try {
          await api.put(`/user/${user._id}`, values);
          toast.success("Updated!");
        } catch (e) {
          console.log(e);
          toast.error("Some Error!");
        }
      }}>
      {({ values, handleChange, handleSubmit, isSubmitting }) => {
        return (
          <React.Fragment>
            <div className="flex justify-between flex-wrap mt-4">
              <div className="w-full md:w-[260px] mt-[10px] md:mt-0 ">
                <div className="text-[14px] text-[#212325] font-medium	">Name</div>
                <input
                  className="projectsInput text-[14px] font-normal text-[#212325] bg-[#F9FBFD] rounded-[10px]"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-[260px] mt-[10px] md:mt-0">
                <div className="text-[14px] text-[#212325] font-medium	">Email</div>
                <input className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]" name="email" value={values.email} onChange={handleChange} />
              </div>
              <div className="w-full md:w-[165px] mt-[10px] md:mt-0">
                <div className="text-[14px] text-[#212325] font-medium	">Status</div>
                <select className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]" type="select" name="status" value={values.status} onClick={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap justify-between mt-4	space-x-3">
              <div className="w-full md:w-[260px] ">
                <div className="text-[14px] text-[#212325] font-medium">Job title</div>
                <input
                  className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px] bg-[#fff]"
                  name="job_title"
                  value={values.job_title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-between mt-4">
              <div className="w-full md:w-[260px] ">
                <div className="text-[14px] text-[#212325] font-medium	">Days worked</div>
                <input
                  className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                  type="number"
                  name="days_worked"
                  value={values.days_worked}
                  onChange={handleChange}
                />{" "}
              </div>
              <div className="w-full md:w-[260px] ">
                <div className="text-[14px] text-[#212325] font-medium	">Cost per day</div>
                <input
                  className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                  type="number"
                  name="costPerDay"
                  value={values.costPerDay}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-[260px] ">
                <div className="text-[14px] text-[#212325] font-medium	">Sell per day</div>
                <input
                  className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                  type="number"
                  name="sellPerDay"
                  value={values.sellPerDay}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full mt-3">
              <div className="text-[14px] text-[#212325] font-medium	">Description</div>
              <textarea
                className="w-full text-[14px] font-normal text-[#212325] border border-[#ced4da] mt-2 rounded-[10px] text-sm p-2  focus:outline-none focus:ring focus:ring-[#80bdff]"
                rows="12"
                name="description"
                value={values.description}
                onChange={handleChange}></textarea>
            </div>

            <div className="flex  mt-2">
              <LoadingButton className="bg-[#0560FD] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]" loading={isSubmitting} onClick={handleSubmit}>
                Update
              </LoadingButton>
              <button className="ml-[10px] bg-[#F43F5E] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]" onClick={deleteData}>
                Delete
              </button>
            </div>
          </React.Fragment>
        );
      }}
    </Formik>
    </>
  );
};
