import { FC } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import Checkbox from "@mui/material/Checkbox";
import CInput from "@components/common/atom/C-Input";
import { ReactComponent as CheckedIcon } from "@assets/checked-icon.svg";
import { SvgIcon } from "@mui/material";
import { WardTabletType } from "@models/ward-tablet";
import { ReactComponent as FilterIcon } from "@/assets/filter-icon.svg";
import { ReactComponent as FilterVerticalIcon } from "@/assets/filter-vertical-icon.svg";
import CButton from "@components/common/atom/C-Button";
import { formatDateDash } from "@utils/getDateform";

const columns = [
  { id: 0, field: "PatientName", headerName: "환자", icon: <FilterVerticalIcon />, width: "144px" },
  { id: 1, field: "Section", headerName: "구역", icon: <FilterIcon />, width: "192px" },
  {
    id: 2,
    field: "TableName",
    headerName: "태블릿 이름",
    icon: <FilterVerticalIcon />,
    width: "192px",
  },
  {
    id: 3,
    field: "TableName",
    headerName: "입원일자",
    icon: <FilterVerticalIcon />,
    width: "96px",
  },
  { id: 4, field: "TableName", headerName: "메모 보기", width: "64px" },
  { id: 5, field: "TableName", headerName: "퇴원 처리 하기", width: "141px" },
];

interface AdminTableProps {
  getTablet: Array<WardTabletType>;
  onChangeSelected: (tabletId: number, patientName: string) => void;
  selected: Array<{
    name: string;
    id: number;
  }>;
}

const AdminTable: FC<AdminTableProps> = ({ getTablet, selected, onChangeSelected }) => {
  console.log(getTablet);
  return (
    <StTable>
      <thead>
        <InoutTableHedaerTr>
          <th style={{ display: "flex" }}>
            <Checkbox
              checked={true}
              icon={
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    border: `1px solid ${palette.divider}`,
                    borderRadius: "6px",
                  }}
                />
              }
              checkedIcon={
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: `${palette.secondary.main}`,
                    borderRadius: "6px",
                    position: "relative",
                  }}
                >
                  <SvgIcon
                    component={CheckedIcon}
                    inheritViewBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "15px",
                      height: "12px",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              }
              sx={{
                padding: 0, // 기본 패딩 제거
                width: "28px",
                height: "28px",
              }}
            />
          </th>
          {columns.map(column => {
            return (
              <InoutTableHeaderTh key={column.id} width={column.width}>
                <p>{column.headerName}</p>
                {column.icon ? column.icon : ""}
              </InoutTableHeaderTh>
            );
          })}
        </InoutTableHedaerTr>
      </thead>

      <tbody>
        {getTablet?.map(tablet => {
          return (
            <InoutTableBodyTr key={tablet.serialNumber || tablet.tabletId}>
              <InoutTableBodyTd width="28px">
                <Checkbox
                  checked={true}
                  icon={
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        border: `1px solid ${palette.divider}`,
                        borderRadius: "6px",
                      }}
                    />
                  }
                  checkedIcon={
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        backgroundColor: `${palette.secondary.main}`,
                        borderRadius: "6px",
                        position: "relative",
                      }}
                    >
                      <SvgIcon
                        component={CheckedIcon}
                        inheritViewBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "15px",
                          height: "12px",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                  }
                  sx={{
                    padding: 0, // 기본 패딩 제거
                    width: "28px",
                    height: "28px",
                  }}
                />
              </InoutTableBodyTd>
              <InoutTableBodyTd width="144px">
                <div style={{ width: "100%", height: "36px" }}>
                  <label htmlFor="section"></label>
                  <CInput
                    placeholder={"구역"}
                    value={tablet.patientName}
                    onChange={() => null}
                    variant={"outlined"}
                    disabled={false}
                    id={"section"}
                  />
                </div>
              </InoutTableBodyTd>
              <InoutTableBodyTd width="192px">
                <ComBoxLayout width={"192px"}>
                  <CComboBox
                    placeholder={"구역"}
                    options={[tablet.areaName]}
                    value={tablet.areaName}
                    onChange={() => null}
                  />
                </ComBoxLayout>
              </InoutTableBodyTd>
              <InoutTableBodyTd width="192px">
                <ComBoxLayout width={"192px"}>
                  <CInput
                    variant={"outlined"}
                    placeholder={"태블릿 이름"}
                    onChange={() => null}
                    value={tablet.tabletName}
                    disabled={true}
                    id={""}
                  ></CInput>
                </ComBoxLayout>
              </InoutTableBodyTd>
              <InoutTableBodyTd width="96px">
                {formatDateDash(new Date(tablet.createdAt))}
              </InoutTableBodyTd>
              <InoutTableBodyTd width="64px"></InoutTableBodyTd>
              <InoutTableBodyTd width="141px">
                <CButton buttontype={"impactRed"}>환자 퇴원 처리</CButton>
              </InoutTableBodyTd>
            </InoutTableBodyTr>
          );
        })}
      </tbody>
    </StTable>
  );
};

export default AdminTable;

const StTable = styled.table`
  width: 100%;
  height: 100%;

  & thead {
    width: 100%;

    display: flex;
    align-items: start;
    border-bottom: 1px solid #c4c5cc;
  }

  & tbody {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const ComBoxLayout = styled.div<{ width: string }>`
  width: ${props => props.width || "100%"};
  height: 36px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 13px;
`;

const InoutTableHedaerTr = styled.tr`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 136.67px;

  padding-left: 24px;
`;

const InoutTableHeaderTh = styled.th<{ width: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: ${props => props.width || "100%"};
  justify-content: center;
  color: ${palette.text.primary};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

const InoutTableBodyTr = styled.tr`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 136.67px;

  border-bottom: 1px solid #c4c5cc;
  padding-left: 24px;
  padding-top: 16px;
  padding-bottom: 16px;
  cursor: pointer;

  &:hover {
    background-color: #30b4ff1a;
  }
`;

const InoutTableBodyTd = styled.td<{ width: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: ${props => props.width || "100%"};
  justify-content: center;
  color: "#000000";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;
