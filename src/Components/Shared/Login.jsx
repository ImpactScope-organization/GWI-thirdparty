import { useStepsContext } from "../../Context/StateContext";
import { useFormik } from "formik";
import { loginModalScehma } from "../../validation-schema";
import axios from "axios";
import { toast } from "react-toastify";
import RequestLoader from "./RequestLoader";
import apiUrl from "../../utils/baseURL";

const Login = () => {
  const {
    openLoginModal,
    setOpenLoginModal,
    requestLoading,
    setRequestLoading,
    setStep,
  } = useStepsContext();

  const initialValues = {
    email: "",
    password: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginModalScehma,

      onSubmit: async (values) => {
        try {
          setRequestLoading(true);
          await axios.post(`${apiUrl}/api/regulator/login`, values).then(() => {
            setRequestLoading(false);
            toast.success("Logged in Successfully");
            setOpenLoginModal(!openLoginModal);
            setStep("all_reports");
          });
        } catch (err) {
          toast.error(err?.response?.data?.message);
          setRequestLoading(false);
          // console.error(err);
        }
      },
    });

  return (
    <div className="fixed z-20 left-0 top-0 right-0 w-full px-4 overflow-x-hidden overflow-y-auto  h-full bg-[rgb(0,0,0,0.75)]">
      <div className="flex justify-center mt-20 w-full">
        <div
          //   onSubmit={handleSubmit}
          className="bg-[#fff] w-[98%] lg:w-[40%] rounded-3xl py-4 px-3  sm:p-6 sm:px-7 md:py-10 md:px-16 "
        >
          <div>
            <div className="flex justify-center items-center ">
              <img src="./assets/__logo.png" alt="logo" className="w-[80px]" />
              <div className="ml-[10px]">
                <h1 className="text-lg font-bold text-darkBlack leading-5">
                  Greenwashing <br /> Identifier
                </h1>
                <p className="text-sm text-reportGrey ">By ImpactScope</p>
              </div>
            </div>
            <h3 className="text-darkBlack mt-8 text-2xl sm:text-3xl md:text-4xl font-[700] text-center leading-[48px]">
              Welcome to GWI
            </h3>

            <p className="font-BalsamiqSans text-center text-reportGrey text-lg mt-3 ">
              Sign in to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full mt-5 space-y-3">
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className="p-4 bg-[#f5f4f4] rounded-lg border-none focus:outline-none w-full"
            />

            {errors.email && touched.email ? (
              <p className="text-sm text-[#ff0000]">{errors.email}</p>
            ) : null}

            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className="p-4 bg-[#f5f4f4] border-none rounded-lg focus:outline-none w-full"
            />
            {errors.password && touched.password ? (
              <p className="text-sm  text-[#ff0000]">{errors.password}</p>
            ) : null}

            <div className="!mt-10">
              <button
                type="submit"
                className="bg-primary cursor-pointer w-full relative h-[64px]  text-white text-center  rounded-md  py-3 text-lg font-medium"
              >
                {requestLoading ? <RequestLoader /> : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
