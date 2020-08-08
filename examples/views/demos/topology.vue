<template>
  <el-container>
    <el-header height="60px">
      <el-row>
        <el-col :span="8" style="text-align: left">
          <router-link to="/">
            <div class="navbar-brand">
              <img id="logo" src="@/assets/logo.png" width="38px" height="38px" alt="CCEditor"/>
              <span> CCEditor </span>
            </div>
          </router-link>
        </el-col>
        <el-col :span="8" style="text-align: center">
          <div class="navbar-title">&nbsp;</div>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <div class="navbar-btns">
            <div v-if="graphMode === 'preview'">
              <el-button size="mini" @click="handleEditClick">编辑</el-button>
              <el-button size="mini" @click="handleRefreshClick">刷新</el-button>
              <el-dropdown @command="toggleAutoRefresh" style="margin-left: 10px;">
                <el-button class="refresh-button" size="mini">
                  <span v-if="autoRefresh.interval === 'close'">关闭</span>
                  <span v-else>{{autoRefresh.interval}}分钟刷新</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">1分钟</el-dropdown-item>
                  <el-dropdown-item command="5">5分钟</el-dropdown-item>
                  <el-dropdown-item command="10">10分钟</el-dropdown-item>
                  <el-dropdown-item command="30">30分钟</el-dropdown-item>
                  <el-dropdown-item command="close">关闭</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div v-else-if="graphMode === 'edit'">
              <el-button size="mini" @click="handleLayoutClick">自动布局</el-button>
              <el-button size="mini" @click="handlePreviewClick">返回</el-button>
              <el-button size="mini" @click="handleGraphDataSave">保存</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <cc-topology
        ref="topology"
        :graph-data="graphData"
        :node-type-list="nodeTypeList"
        :node-app-config="nodeAppConfig">
      </cc-topology>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import {CCTopology} from '../../../packages/index'
import {getRandomArrayElements} from '../../utils/index'

export default {
  name: 'DemoTopology',
  components: {
    'cc-topology': CCTopology
  },
  data () {
    return {
      graphData: {
        nodes: [
          {
            id: 'client-01',
            x: -95,
            y: -50,
            label: '客户端-01',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABICAYAAAB7qJLVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAACcQAAAnEAGUaVEZAAAAB3RJTUUH4wUGFSkCASqMfAAABb9JREFUeNrtnE1vG8cZgJ93hkty9WHISR2kimC1SOAgaIEg6CmpiwJFCwdtgBY+5hi76K2HXPMDeizQS5BrDjkZdmA4SNxDERT2oT0Z6ZcbBEVc1zHhKpJrkxSXOztvDxQZ0qYUrmUuV+I8F4GLmf14NPvOO7O7A4FCka8rcObMGQBUddbnWipUlWazSZZlABhjADh37tye9XYV3hfdx3svQXoPEcF7z82bN02SJKyurrKxsZHFcYy1FlXl0qVL4+uO2zgkW4DvA68Ca0xwR8wR4pyLWq2W3d7e9qr6b+CDer3+x263q8YYLl68+FClyrg9qSrWWrz3rwO/BY7N+urKSKVSYXl5GYBWqwXwRqfTefPWrVvvrq+vj61jxm3cuWWeAd4iyN4TYwxLS0tUKhWAJ1X1rbW1teP92P5Q+T329TzwrVlf0EHAWksURf2f68B3duvv9hK+yC4hJ/AwIoPurSIiy7uVyy1UjOnfPnOPcw71PledXOYqUZWTr77G8WdPzH1enqry2afXufaHj3Dd7sT1JhbuvefYN5/hez/4EfFiHebbN4kH+8QxbvztE+7c+NfE9XK18Kga9dLFLE+tw4nPPGIMNsoXXk2u0sDcN+0RlLyR9RGEB/ZDEF4wQXjBBOEFE4QXTDFDxoMyqVtAAjZ14VnqyLpp7vSpaETAVqPceXVeprp3n3madzZJO5MPfWdJVK+y/PQ3MHZ6kXaqMVyzjCx10zzEYyVLHZpNdxgdOs2CCcILJggvmCC8YILwgplqWijWYqsRekDSQluNEGuneoypCjfWsPzUEwcmNbRRZao5OBQw0jQVi4mm22oeG4dhaF/UhRwUQqdZMKV9wWS/E4xlvalKKVzxbGZ3SHQbyaleUWoSc9Q+hZTwBi6dcAFupp9xZft9Et/J39QVaibmZPxzjkcnStfSSyccoOE+p+n/h8E+Umxo+rs03Occj07M+lIeonz3HL2wkDeUDCMIWrq23aOUwmF/nV45VfcoZUhZMMsIgiffm6l9BGHBLD9S3WlTOuEKPFd9EacpLX8PyRlZVGHRHOG56oulbOmlEw5Ql0Veqv9wX/soo2woqXAor7D9UtpO87AShBdMEF4wQXjBBOEFE4QXTBBeMEF4weQe+OgDf+cV5z0KuaceJhYuwHanw3+bLeqLQulf+J4iSu9L5Cx1pEmSq+7kwo3hy9u3+PPvP2Dthe8iInPrXKS3psx//vFXthpfIGbyyLzrAjWqas0DO/JZxt+vfsw//3T14HxGMi0UMpfmrjZWeLvdxntfXVhYMHbMq1+PcqBAj7HCm80mwCbQXVpaiiVvzzBnqCr+q2U8uqr65W5lK3vs5JNWq3U9y7KX4jgmSN+dbrdLstN5ish1EfnLbr5Gtg6vUdjpdLh79+4pVf2diJTv8XeJGFo75lNjzK+zLLtcqVRwzrGwsMD58+cHZce2cBFZieP4J3Ecv5ym6e00Tb+tqtEEx55nUufc7Xa7/VNr7ZPAR8aYzXa7PVJo0MLPnj3b/089DbwN/AwIkidERMiyjK2tLZIkyUTkQxH5lap+UavVuHDhAjB+aP8G8AuC7FyoKuar9cCsqr6mqr9M05Th9NoMV6An+ZVZn/wh4uV6vV5LhkajgxieJAmqWqnVakshI3k8qGrdOTcSRQY/Njc3aTQadDqdWZ/noWYkpIgI9+/fJ8k5IRNgZ25JcW7v75kGIcVai7XWO+fSra0t4jgOC0LmJE1TukNrGIpIaq31w2s8DoxWq1UajUaysrJyzXv/453VggP749rGxkayuro62DASUlZWVhCRd4Crsz7TQ8AVEXnn6NGjIxtH0pFTp071w8i6qr4OnARqhAc8kyJAAlwxxrynqjecc1y+fHlQYCRI7yzSjjHmRpqmvzly5EhVVcNzzxyIiL937163Wq3ivefB6e2xCffp06cBhqccAznojyyHJ60CM+L/5UoejpR/JKUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDUtMDZUMjE6NDE6MDIrMDg6MDCIwcUDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA1LTA2VDIxOjQxOjAyKzA4OjAw+Zx9vwAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADYxMo3L7dgAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANzgzuT1cbQAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTU3MTUwMDYyDS3pMwAAABF0RVh0VGh1bWI6OlNpemUAOTg0MUJ1EjZzAAAAYnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzEyMy8xMjMzMzgyLnBuZ6YwiUMAAAAASUVORK5CYII=',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'client-02',
            x: 125,
            y: -50,
            label: '客户端-02',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABICAYAAAB7qJLVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAACcQAAAnEAGUaVEZAAAAB3RJTUUH4wUGFSkCASqMfAAABb9JREFUeNrtnE1vG8cZgJ93hkty9WHISR2kimC1SOAgaIEg6CmpiwJFCwdtgBY+5hi76K2HXPMDeizQS5BrDjkZdmA4SNxDERT2oT0Z6ZcbBEVc1zHhKpJrkxSXOztvDxQZ0qYUrmUuV+I8F4GLmf14NPvOO7O7A4FCka8rcObMGQBUddbnWipUlWazSZZlABhjADh37tye9XYV3hfdx3svQXoPEcF7z82bN02SJKyurrKxsZHFcYy1FlXl0qVL4+uO2zgkW4DvA68Ca0xwR8wR4pyLWq2W3d7e9qr6b+CDer3+x263q8YYLl68+FClyrg9qSrWWrz3rwO/BY7N+urKSKVSYXl5GYBWqwXwRqfTefPWrVvvrq+vj61jxm3cuWWeAd4iyN4TYwxLS0tUKhWAJ1X1rbW1teP92P5Q+T329TzwrVlf0EHAWksURf2f68B3duvv9hK+yC4hJ/AwIoPurSIiy7uVyy1UjOnfPnOPcw71PledXOYqUZWTr77G8WdPzH1enqry2afXufaHj3Dd7sT1JhbuvefYN5/hez/4EfFiHebbN4kH+8QxbvztE+7c+NfE9XK18Kga9dLFLE+tw4nPPGIMNsoXXk2u0sDcN+0RlLyR9RGEB/ZDEF4wQXjBBOEFE4QXTDFDxoMyqVtAAjZ14VnqyLpp7vSpaETAVqPceXVeprp3n3madzZJO5MPfWdJVK+y/PQ3MHZ6kXaqMVyzjCx10zzEYyVLHZpNdxgdOs2CCcILJggvmCC8YILwgplqWijWYqsRekDSQluNEGuneoypCjfWsPzUEwcmNbRRZao5OBQw0jQVi4mm22oeG4dhaF/UhRwUQqdZMKV9wWS/E4xlvalKKVzxbGZ3SHQbyaleUWoSc9Q+hZTwBi6dcAFupp9xZft9Et/J39QVaibmZPxzjkcnStfSSyccoOE+p+n/h8E+Umxo+rs03Occj07M+lIeonz3HL2wkDeUDCMIWrq23aOUwmF/nV45VfcoZUhZMMsIgiffm6l9BGHBLD9S3WlTOuEKPFd9EacpLX8PyRlZVGHRHOG56oulbOmlEw5Ql0Veqv9wX/soo2woqXAor7D9UtpO87AShBdMEF4wQXjBBOEFE4QXTBBeMEF4weQe+OgDf+cV5z0KuaceJhYuwHanw3+bLeqLQulf+J4iSu9L5Cx1pEmSq+7kwo3hy9u3+PPvP2Dthe8iInPrXKS3psx//vFXthpfIGbyyLzrAjWqas0DO/JZxt+vfsw//3T14HxGMi0UMpfmrjZWeLvdxntfXVhYMHbMq1+PcqBAj7HCm80mwCbQXVpaiiVvzzBnqCr+q2U8uqr65W5lK3vs5JNWq3U9y7KX4jgmSN+dbrdLstN5ish1EfnLbr5Gtg6vUdjpdLh79+4pVf2diJTv8XeJGFo75lNjzK+zLLtcqVRwzrGwsMD58+cHZce2cBFZieP4J3Ecv5ym6e00Tb+tqtEEx55nUufc7Xa7/VNr7ZPAR8aYzXa7PVJo0MLPnj3b/089DbwN/AwIkidERMiyjK2tLZIkyUTkQxH5lap+UavVuHDhAjB+aP8G8AuC7FyoKuar9cCsqr6mqr9M05Th9NoMV6An+ZVZn/wh4uV6vV5LhkajgxieJAmqWqnVakshI3k8qGrdOTcSRQY/Njc3aTQadDqdWZ/noWYkpIgI9+/fJ8k5IRNgZ25JcW7v75kGIcVai7XWO+fSra0t4jgOC0LmJE1TukNrGIpIaq31w2s8DoxWq1UajUaysrJyzXv/453VggP749rGxkayuro62DASUlZWVhCRd4Crsz7TQ8AVEXnn6NGjIxtH0pFTp071w8i6qr4OnARqhAc8kyJAAlwxxrynqjecc1y+fHlQYCRI7yzSjjHmRpqmvzly5EhVVcNzzxyIiL937163Wq3ivefB6e2xCffp06cBhqccAznojyyHJ60CM+L/5UoejpR/JKUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDUtMDZUMjE6NDE6MDIrMDg6MDCIwcUDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA1LTA2VDIxOjQxOjAyKzA4OjAw+Zx9vwAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADYxMo3L7dgAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANzgzuT1cbQAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTU3MTUwMDYyDS3pMwAAABF0RVh0VGh1bWI6OlNpemUAOTg0MUJ1EjZzAAAAYnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzEyMy8xMjMzMzgyLnBuZ6YwiUMAAAAASUVORK5CYII=',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'client-03',
            x: 348,
            y: -50,
            label: '客户端-03',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABICAYAAAB7qJLVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAACcQAAAnEAGUaVEZAAAAB3RJTUUH4wUGFSkCASqMfAAABb9JREFUeNrtnE1vG8cZgJ93hkty9WHISR2kimC1SOAgaIEg6CmpiwJFCwdtgBY+5hi76K2HXPMDeizQS5BrDjkZdmA4SNxDERT2oT0Z6ZcbBEVc1zHhKpJrkxSXOztvDxQZ0qYUrmUuV+I8F4GLmf14NPvOO7O7A4FCka8rcObMGQBUddbnWipUlWazSZZlABhjADh37tye9XYV3hfdx3svQXoPEcF7z82bN02SJKyurrKxsZHFcYy1FlXl0qVL4+uO2zgkW4DvA68Ca0xwR8wR4pyLWq2W3d7e9qr6b+CDer3+x263q8YYLl68+FClyrg9qSrWWrz3rwO/BY7N+urKSKVSYXl5GYBWqwXwRqfTefPWrVvvrq+vj61jxm3cuWWeAd4iyN4TYwxLS0tUKhWAJ1X1rbW1teP92P5Q+T329TzwrVlf0EHAWksURf2f68B3duvv9hK+yC4hJ/AwIoPurSIiy7uVyy1UjOnfPnOPcw71PledXOYqUZWTr77G8WdPzH1enqry2afXufaHj3Dd7sT1JhbuvefYN5/hez/4EfFiHebbN4kH+8QxbvztE+7c+NfE9XK18Kga9dLFLE+tw4nPPGIMNsoXXk2u0sDcN+0RlLyR9RGEB/ZDEF4wQXjBBOEFE4QXTDFDxoMyqVtAAjZ14VnqyLpp7vSpaETAVqPceXVeprp3n3madzZJO5MPfWdJVK+y/PQ3MHZ6kXaqMVyzjCx10zzEYyVLHZpNdxgdOs2CCcILJggvmCC8YILwgplqWijWYqsRekDSQluNEGuneoypCjfWsPzUEwcmNbRRZao5OBQw0jQVi4mm22oeG4dhaF/UhRwUQqdZMKV9wWS/E4xlvalKKVzxbGZ3SHQbyaleUWoSc9Q+hZTwBi6dcAFupp9xZft9Et/J39QVaibmZPxzjkcnStfSSyccoOE+p+n/h8E+Umxo+rs03Occj07M+lIeonz3HL2wkDeUDCMIWrq23aOUwmF/nV45VfcoZUhZMMsIgiffm6l9BGHBLD9S3WlTOuEKPFd9EacpLX8PyRlZVGHRHOG56oulbOmlEw5Ql0Veqv9wX/soo2woqXAor7D9UtpO87AShBdMEF4wQXjBBOEFE4QXTBBeMEF4weQe+OgDf+cV5z0KuaceJhYuwHanw3+bLeqLQulf+J4iSu9L5Cx1pEmSq+7kwo3hy9u3+PPvP2Dthe8iInPrXKS3psx//vFXthpfIGbyyLzrAjWqas0DO/JZxt+vfsw//3T14HxGMi0UMpfmrjZWeLvdxntfXVhYMHbMq1+PcqBAj7HCm80mwCbQXVpaiiVvzzBnqCr+q2U8uqr65W5lK3vs5JNWq3U9y7KX4jgmSN+dbrdLstN5ish1EfnLbr5Gtg6vUdjpdLh79+4pVf2diJTv8XeJGFo75lNjzK+zLLtcqVRwzrGwsMD58+cHZce2cBFZieP4J3Ecv5ym6e00Tb+tqtEEx55nUufc7Xa7/VNr7ZPAR8aYzXa7PVJo0MLPnj3b/089DbwN/AwIkidERMiyjK2tLZIkyUTkQxH5lap+UavVuHDhAjB+aP8G8AuC7FyoKuar9cCsqr6mqr9M05Th9NoMV6An+ZVZn/wh4uV6vV5LhkajgxieJAmqWqnVakshI3k8qGrdOTcSRQY/Njc3aTQadDqdWZ/noWYkpIgI9+/fJ8k5IRNgZ25JcW7v75kGIcVai7XWO+fSra0t4jgOC0LmJE1TukNrGIpIaq31w2s8DoxWq1UajUaysrJyzXv/453VggP749rGxkayuro62DASUlZWVhCRd4Crsz7TQ8AVEXnn6NGjIxtH0pFTp071w8i6qr4OnARqhAc8kyJAAlwxxrynqjecc1y+fHlQYCRI7yzSjjHmRpqmvzly5EhVVcNzzxyIiL937163Wq3ivefB6e2xCffp06cBhqccAznojyyHJ60CM+L/5UoejpR/JKUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDUtMDZUMjE6NDE6MDIrMDg6MDCIwcUDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA1LTA2VDIxOjQxOjAyKzA4OjAw+Zx9vwAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADYxMo3L7dgAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANzgzuT1cbQAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTU3MTUwMDYyDS3pMwAAABF0RVh0VGh1bWI6OlNpemUAOTg0MUJ1EjZzAAAAYnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzEyMy8xMjMzMzgyLnBuZ6YwiUMAAAAASUVORK5CYII=',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'firewall-01',
            x: 14,
            y: 88,
            label: '防火墙',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,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',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'firewall-02',
            x: 348,
            y: 88,
            label: '防火墙',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,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',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'server-01',
            x: -95,
            y: 205,
            label: '服务器',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,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',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'server-02',
            x: 348,
            y: 205,
            label: '服务器',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,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',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'database-01',
            x: 125,
            y: 150,
            label: '数据库',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,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',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          },
          {
            id: 'database-02',
            x: 125,
            y: 290,
            label: '数据库',
            labelCfg: {
              position: 'bottom'
            },
            type: 'cc-image',
            img: 'data:image/png;base64,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',
            size: [55, 55],
            width: 48,
            height: 48,
            anchorPoints: [
              [0.5, 0], // top
              [1, 0.5], // right
              [0.5, 1], // bottom
              [0, 0.5] // left
            ],
            appState: {
              alert: false
            },
            appConfig: {
              ip: '',
              port: '',
              sysName: ''
            }
          }
        ],
        edges: [
          {
            id: 'edge-01',
            source: 'client-03',
            sourceAnchor: 2,
            target: 'firewall-02',
            type: 'cc-line',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 0
          },
          {
            id: 'edge-02',
            source: 'client-01',
            sourceAnchor: 2,
            target: 'firewall-01',
            type: 'cc-polyline',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 0
          },
          {
            id: 'edge-03',
            source: 'client-02',
            sourceAnchor: 2,
            target: 'firewall-02',
            type: 'cc-polyline',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 3
          },
          {
            id: 'edge-04',
            source: 'firewall-02',
            sourceAnchor: 2,
            target: 'server-02',
            type: 'cc-cubic',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 0
          },
          {
            id: 'edge-05',
            source: 'firewall-01',
            sourceAnchor: 2,
            target: 'server-01',
            type: 'cc-cubic',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 0
          },
          {
            id: 'edge-06',
            source: 'server-01',
            sourceAnchor: 1,
            target: 'database-01',
            type: 'cc-line',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 3
          },
          {
            id: 'edge-07',
            source: 'database-01',
            sourceAnchor: 1,
            target: 'server-02',
            type: 'cc-line',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 3
          },
          {
            id: 'edge-08',
            source: 'server-02',
            sourceAnchor: 3,
            target: 'database-02',
            type: 'cc-line',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 1
          },
          {
            id: 'edge-09',
            source: 'database-02',
            sourceAnchor: 3,
            target: 'server-01',
            type: 'cc-line',
            style: {
              stroke: '#A3B1BF',
              lineWidth: 2,
              strokeOpacity: 0.92,
              lineAppendWidth: 10,
              startArrow: false,
              endArrow: false
            },
            labelCfg: {
              position: 'center',
              autoRotate: false
            },
            targetAnchor: 1
          }
        ]
      },
      nodeTypeList: [
        { guid: 'blue', label: '服务器', imgSrc: require('../../assets/images/server.png') },
        { guid: 'green', label: '数据库', imgSrc: require('@/assets/images/database.png') },
        { guid: 'purple', label: '防火墙', imgSrc: require('@/assets/images/firewall.png') },
        { guid: 'purple', label: '客户端', imgSrc: require('@/assets/images/client.png') }
      ],
      // 节点配置
      nodeAppConfig: {
        ip: '节点IP',
        port: '节点端口',
        sysName: '设备名称'
      },
      autoRefresh: {
        enable: false,
        interval: 5
      },
      autoRefreshTimer: null,
      dataUpdateTime: '暂无关联数据',
      graphMode: 'preview'
    }
  },
  mounted () {
    this.initGraphData()
    let theme = 'darkStyle'
    this.$refs.topology.changeGraphTheme(theme)
  },
  methods: {
    handleEditClick () {
      clearInterval(this.autoRefreshTimer)
      this.graphMode = 'edit'
      let graphData = _.cloneDeep(this.graphData)
      this.$refs.topology.changeGraphMode(graphData, 'edit')
    },
    handleRefreshClick () {
      this.getRelatedData()
    },
    handleLayoutClick () {
      this.$refs.topology.forceLayoutHandler()
    },
    handlePreviewClick () {
      this.graphMode = 'preview'
      // 需要先去异步请求获取远程的 graphData
      let graphData = _.cloneDeep(this.graphData)
      this.$refs.topology.changeGraphMode(graphData, 'preview')
      this.handleRefreshClick()
    },
    toggleAutoRefresh (command) {
      if (command && command !== 'close') {
        this.autoRefresh.interval = Number(command)
        clearInterval(this.autoRefreshTimer)
        this.autoRefreshTimer = setInterval(() => {
          this.getRelatedData()
        }, this.autoRefresh.interval * 60 * 1000)
        this.$once('hook:beforeDestroy', () => {
          clearInterval(this.autoRefreshTimer)
        })
      } else {
        this.autoRefresh.interval = command
        clearInterval(this.autoRefreshTimer)
      }
    },
    initGraphData () {
      // 异步请求获取远程的 graphData
      let graphData = _.cloneDeep(this.graphData)
      this.$refs.topology.initTopo(graphData)
      this.handleRefreshClick()
    },
    handleGraphDataSave () {
      let { nodes, edges, groups, combos } = this.$refs.topology.getGraphData()
      console.log(JSON.stringify({ nodes, edges, groups, combos }))
    },
    getRelatedData () {
      this.dataUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss')
      let graphData = _.cloneDeep(this.$refs.topology.getGraphData())
      let { nodes, edges } = graphData
      // let randomIdx = Math.floor((Math.random() * nodes.length))
      let randomNodeIds = getRandomArrayElements(nodes, 1).map(x => {
        return x.id
      })
      for (let i = 0, len = nodes.length; i < len; i++) {
        let node = nodes[i]
        if (randomNodeIds.indexOf(node.id) > -1) {
          node.description = `<p class="tooltips-title text-center">${node.label}</p>
                <table class="tooltips-table">
                <tr>
                <td style="text-align:left;color:#303133">设备IP: 10.5.97.1</td>
                </tr>
                <tr>
                <td style="text-align:left;color:#303133">设备名称: chaincloud-01</td>
                </tr>
                <tr>
                <td style="text-align:left;color:#ff0000">CPU使用率: 99%</td>
                </tr>
                <tr>
                <td style="text-align:left;color:#ff0000">内存使用率: 72%</td>
                </tr>
                <tr>
                <td style="text-align:left;color:#303133">最近刷新时间: ${this.dataUpdateTime}</td>
                </tr>
                </table>`
          node.appState.alert = true
        } else {
          nodes[i].appState.alert = false
          nodes[i]['description'] = '<p class="tooltips-title text-center">没有数据</p>'
        }
      }
      this.$refs.topology.changeGraphData(graphData)
    }
  },
  watch: {
    graphMode (value) {
      if (value === 'preview') {
        // let themes = ['darkStyle', 'darkStyle', 'officeStyle']
        // let idx = Math.floor((Math.random() * themes.length))
        // let theme = themes[idx]
        let theme = 'darkStyle'
        this.$refs.topology.changeGraphTheme(theme)
      } else {
        let theme = 'defaultStyle'
        this.$refs.topology.changeGraphTheme(theme)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-header {
    line-height: 60px;
    text-align: center;
    background-color: #FDFDFD;
    box-shadow: 0 2px 8px rgba(229, 229, 229, 0.5);

    .navbar-brand {
      display: inline-block;
      margin: 0 18px 0 35px;
      /*padding: 0 0 0 8px;*/
      line-height: 22px;
      font-size: 20px;

      img {
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
        /*font-family: "Microsoft YaHei";*/
        color: #06080A;
      }
    }

    .navbar-title {
      vertical-align: middle;
      text-align: center;
      font-size: 20px;
    }

    .navbar-btns {
      vertical-align: middle;
      text-align: right;

      .el-button:last-child {
        margin-right: 20px;
      }

      .el-button--text {
        color: #06080A;
      }
    }
  }

  .el-main {
    margin: 0;
    padding: 0;
    text-align: center;
  }

  .el-footer {
    width: 100%;
    line-height: 55px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.45);
    background-color: #06080A;
    border: none;
    border-top: 1px solid rgba(197, 203, 217, 0.3);
  }
}
</style>
